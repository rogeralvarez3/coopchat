const mysql = require("mysql");
const conección = mysql.createConnection({
  host: "192.168.1.66",
  port: "3312",
  user: "root",
  password: "root@",
  database: "coopechat",
  multipleStatements: true
});
const login = function(usuario) {
  var result = new Promise(resolve => {
    strUsuario = usuario.correo.toString().replace(/\@(.*)/, "");
    var sql = `select * from usuarios where left(correo,position('@' in correo)-1)='${strUsuario}' and pass='${usuario.pass}'`;
    conección.query(sql, (err, rows) => {
      if (err) {
        resolve(err);
      } else {
        if (rows.length > 0) {
          resolve(rows[0]);
        } else {
          resolve({ error: "Contraseña o usario incorrecto" });
        }
      }
    });
  });
  return result;
};
const saveUser = function(data) {
  var result = new Promise(resolve => {
    var sql = `insert into usuarios(nombre, correo, contraseña) values('${data.nombre}','${data.correo}','${data.contraseña}')`;
    if (data.id > 0) {
      sql = `update usuarios set nombre='${data.nombre}',correo='${data.correo}',contraseña='${data.contraseña}'`;
    }
    conección.query(sql, (err, rows) => {
      if (err) {
        resolve(err);
      } else {
        resolve(rows[1]);
      }
    });
  });
  return result;
};
const getMsgs = function(usuario) {
  var result = new Promise(resolve => {
    var sql = `select * from mensajes where usuario=${usuario} or destino=${usuario}`;
    conección.query(sql, (err, rows) => {
      if (err) {
        resolve(err);
      } else {
        if (rows.length > 0) {
          resolve(rows);
        } else {
          resolve([]);
        }
      }
    });
  });
  return result;
};
const saveMsg = function(data) {
  var result = new Promise(resolve => {
    var sql = `insert into mensajes(msg,tipo,usuario,destino) values('${
      data.msg
    }','${data.tipo == undefined ? 1 : data.tipo}','${data.usuario}','${
      data.destino
    }');select * from mensajes where id=last_insert_id()`;
    conección.query(sql, (err, rows) => {
      if (err) {
        resolve(err);
      } else {
        if (rows.length > 0) {
          resolve(rows[1][0]);
        } else {
          resolve({});
        }
      }
    });
  });
  return result;
};
const hideMsg = function(data) {
  var result = new Promise(resolve => {
    var sql = `update mensajes set visible=${data.value} where id=${data.id}`;
    conección.query(sql, (err, rows) => {
      if (err) {
        resolve(err);
      } else {
        resolve(rows);
      }
    });
    return result;
  });
};

const exec = function(sql) {
  var result = new Promise(resolve => {
    conección.query(sql, (err, rows) => {
      if (err) {
        resolve(err);
      } else {
        resolve(rows);
      }
    });
  });
  return result;
};
module.exports = {
  login: login,
  getMsgs: getMsgs,
  hideMsg: hideMsg,
  saveMsg: saveMsg,
  saveUser: saveUser,
  exec: exec
};
