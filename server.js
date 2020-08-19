const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
var usuarios = [];
const db = require("./db");
const fs = require("fs");
const bodyParser = require("body-parser");
const history = require("connect-history-api-fallback");
const nodemailer = require("nodemailer");

app.use(cors());
app.use(
  bodyParser({ extended: false, limit: "50mb", type: "application/json" })
);
app.use(history({ verbose: true}));
app.use(express.static(path.resolve(__dirname, "dist")));

const socketIo = require("socket.io");
const port = process.env.PORT || 3001;
server = app.listen(port, () => {
  db.exec("select * from usuarios").then(lista => {
    //console.log(lista)
    if (lista) {
      usuarios = lista;
      usuarios.forEach(u => {
        u.conectado = 0;
      });
    }
  });
  console.log(`Server started on http://localhost:${port}`);
});
const sockets = socketIo.listen(server);
console.log(`Socket escuchando en el puerto ${port}`);
app.post("/upload", req => {
  var data = req.body;
  var d = new Date();
  var filename =
    d.toLocaleDateString().replace(/-/g, "") +
    d.toLocaleTimeString().replace(/:/g, "").replace(/ /g,'') +
    "." +
    data.ext;
  fs.writeFile(
    `${__dirname}/dist/uploads/${filename}`,
    data.mensaje,
    "base64",
    function(err) {
      if (!err) {
        return;
      }
      console.log(err);
    }
  );
  db.exec(
    `insert into mensajes (usuario,destino,msg,tipo) values('${data.usuario}','${data.destino}','${filename}',${data.tipo});select * from mensajes where id=last_insert_id();`
  ).then(r => {
    sockets.to(getSck(data.usuario)).emit("mensaje", r[1][0]);
    sockets.to(getSck(data.destino)).emit("mensaje", r[1][0]);
  });
});

app.post("/requestFile", (req, res) => {
  var data = req.body;
  db.exec(`select * from mensajes where id=${data}`).then(r => {
    res.send(r[0]);
  });
});

app.post("/recuperarPass", (req, res) => {
  var data = req.body;
  strUsuario = data.usuario.toString().replace(/\@(.*)/, "");
  db.exec(
    `select correo,pass from usuarios where left(correo,position('@' in correo)-1)='${strUsuario}'`
  ).then(r => {
    console.log(r);
    if (r[0]) {
      let transporter = nodemailer.createTransport({
        host: "190.184.91.51",
        port: 25,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "webmaster@coopefacsa.coop", // generated ethereal user
          pass: "Cc123456@" // generated ethereal password
        }
      });
      transporter.sendMail(
        {
          from: '"COOPCHAT" <webmaster@coopefacsa.coop>;', // sender address
          to: r[0].correo, // list of receivers
          subject: "Recuperación de contraseña", // Subject line
          html: `<h4>Usted ha solicitado recuperar su contraseña</h4><br><strong>Contraseña:</strong>&nbsp;${r[0].pass}` // html body
        },
        info => {
          console.log(info);
          res.send(info);
        }
      );
    }
  });
});
app.post("/changePass", (req, res) => {
  var data = req.body;
  db.exec(
    `update usuarios set pass='${data.pass}' where id=${data.usuario}`
  ).then(r => {
    res.send(r);
  });
});
app.post("/getUsers", (req, res) => {
  res.send(usuarios)
})
sockets.on("connection", sck => {
  sockets.emit("refreshUsers", usuarios);
  sck.on("login", data => {
    db.login(data).then(res => {
      if (res.id) {
        var usuario = usuarios.filter(u => {
          return u.id == res.id;
        });
        if (usuario.length > 0) {
          usuario[0].sck = sck.id;
          usuario[0].conectado = 1;
        } else {
          res.conectado = 1;
          usuarios.push(res);
        }
      } else {
        console.log(res);
      }

      sck.emit("login", res);
      sockets.emit("refreshUsers", usuarios);
    });
  });
  sck.on("logout", data => {
    var i = usuarios.findIndex(u => {
      return u.id == data;
    });
    usuarios[i].conectado = 0;
    sockets.emit("refreshUsers", usuarios);
  });
  sck.on("disconnect", () => {
    var i = usuarios.findIndex(r => {
      return r.sck == sck.id;
    });
    if (usuarios[i]) {
      usuarios[i].conectado = 0;
    }

    sockets.emit("refreshUsers", usuarios);
  });
  sck.on("mensaje", data => {
    var destino = usuarios.findIndex(u => {
      return u.id == data.destino;
    });
    db.saveMsg(data).then(r => {
      if (r.errNo) {
        return;
      } else {
        sck.emit("mensaje", r);
        sockets.to(usuarios[destino].sck).emit("mensaje", r);
      }
    });
  });
  sck.on("getMsgs", data => {
    db.getMsgs(data).then(r => {
      sck.emit("getMsgs", r);
    });
  });
  sck.on("msgReaded", data => {
    var sql = `update mensajes set leido=1 where usuario=${data.origen} and destino=${data.destino}`;
    db.exec(sql).then(r => {
      if (r.errno) {
        console.log(r);
        return;
      } else {
        sockets.to(getSck(data.origen)).emit("mensajesLeidos", data.destino);
      }
    });
  });
  sck.on("setUserImg", data => {
    var sql = `update usuarios set imagen='${data.img}' where id=${data.id}`;

    db.exec(sql).then(r => {
      if (!r.errno) {
        var i = usuarios.findIndex(u => {
          return u.id == data.id;
        });
        if (i >= 0) {
          usuarios[i] = data.img;
        }
        sockets.emit("userImgChanged", data);
      } else {
        console.log(r);
      }
    });
  });
});
function getSck(u) {
  var i = usuarios.findIndex(usr => {
    return usr.id == u;
  });
  if (i > -1) {
    return usuarios[i].sck;
  }
}
