<template>
  <v-app>
    <v-navigation-drawer app clipped>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            <v-card>
              <v-card-text>
                <v-img
                  v-if="$store.state.user.id == 0 || $store.state.user.imagen.length == 0" 
                  src="data:image/png;base64,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"
                  width="150"
                ></v-img>
                <v-img
                  v-if="$store.state.user.id > 0 && $store.state.user.imagen.length > 0"
                  :src="$store.state.user.imagen"
                  width="150"
                ></v-img>
              </v-card-text>
              <v-card-title>
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on">{{ $store.state.user.nombre }}</v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item @click="$refs.inputImgProfile.click()">
                      <v-list-item-title>Cambiar imagen</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="dlgChangePass=true">
                      <v-list-item-title>Cambiar contraseña</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="salir()">
                      <v-list-item-title>Salir</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-title>
            </v-card>
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item class="blue-grey lighten-5">
          <v-list-item-title>
            <strong>Usuarios</strong>
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          v-for="u in userList"
          :key="u.id"
          @click="$router.push(`/chat/${u.id}`).catch(err => {});msgReaded(u.id);">
          <v-list-item-icon>
            <v-avatar small class="elevation-1">
              <img :src="u.imagen" v-if="u.imagen.length" />
              <v-icon v-else>mdi-account</v-icon>
            </v-avatar>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title :class="u.conectado == 0 ? 'desconectado' : 'conectado'">
              {{ u.nombre }}
              <v-badge v-if="noLeidos(u.id) > 0" color="error">
                <template v-slot:badge>{{ noLeidos(u.id) }}</template>
                <v-icon>mdi-message-alert</v-icon>
              </v-badge>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <input
      type="file"
      style="display:none"
      ref="inputImgProfile"
      @change="changeImageProfile()"
      multiple="false"
    />
    <v-content>
      <router-view></router-view>
    </v-content>
    <Login :user="$store.state.user" v-on:entrar="entrar()"></Login>
    <v-dialog v-model="dlgChangePass" width="400">
      <v-card>
        <v-card-title class="blue-grey lighten-5">
          <v-icon>mdi-key-change</v-icon>&nbsp;Cambiar contraseña
          <v-spacer></v-spacer>
          <v-btn text fab @click="dlgChangePass=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            ref="txtP"
            v-model="newPass"
            label="Nueva contraseña"
            :type="showPass ? 'text' : 'password'"
            @keypress.13="cambiarPass()"
            @click:append="showPass=!showPass"
            :append-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn fab color="primary" class="elevation-1" @click="cambiarPass()">
            <v-icon>mdi-check</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Login from "./components/Login";
import Chat from "./components/Chat";
import socketIo from "socket.io-client";
import axios from "axios";
export default {
  name: "App",
  components: { Login, Chat },
  data: () => ({
    //
    dlgChangePass: false,
    newPass: "",
    showPass: false
  }),
  watch: {
    $route(to, from) {
      console.log(to.params.id);
      this.selectUser(to.params.id);
    }
  },
  methods: {
    entrar: function() {
      this.$store.state.sck.emit("login", this.$store.state.user);
    },
    selectUser: function(id) {
      if (!id) {
        return;
      }
      var i = this.$store.state.users.findIndex(flt => {
        return flt.id == id;
      });
      var user = this.$store.state.users[i];
      this.$store.commit("selectUser", user);
    },
    menuClick: function() {},
    salir: function() {
      var mv = this.$store.state;
      sessionStorage.removeItem("user");
      mv.sck.emit("logout", mv.user.id);
      mv.user.id = 0;
      mv.user.nombre = "";
      mv.user.img = "";
      mv.user.pass = "";
    },
    getMsgs: function() {
      var mv = this.$store.state;
      mv.sck.emit("getMsgs", mv.user.id);
    },

    msgReaded: function(u) {
      this.$store.commit("setMsgReaded", u);
    },
    noLeidos: function(u) {
      var result = 0;
      var mv = this.$store.state;
      mv.mensajes.forEach(m => {
        if (m.usuario == u && m.leido == 0) {
          result += 1;
        }
      });
      return result;
    },

    changeImageProfile: function() {
      var mv = this;
      var input = mv.$refs.inputImgProfile;
      var file = input.files[0];
      var FR = new FileReader();
      FR.addEventListener("load", function(e) {
        resizeBase64Img(e.target.result, 120, 130).then(r => {
          mv.$store.state.sck.emit("setUserImg", {
            id: mv.$store.state.user.id,
            img: r
          });
        });
      });
      FR.readAsDataURL(file);
    },
    saveUser: function() {
      var mv = this;
      mv.$store.state.sck.emit("saveUser", mv.$store.state.user);
    },
    notify: function(titulo, mensaje) {
      var mv = this;
      mv.$notification.show(
        titulo,
        { body: mensaje },
        { onclick: mv.abrirBrowser(mensaje.usuario) }
      );
    },
    abrirBrowser: function(usuario) {
      window.open(`http://localhost:8080/chat/${usuario}`, "coopechat", true);
    },
    cambiarPass: function() {
      var mv = this;
      axios
        .post(mv.$store.state.api + "/changePass", {
          pass: mv.newPass,
          usuario: mv.$store.state.user.id
        })
        .then(r => {
          if (r.data.errno) {
            mv.$swal({ type: "error", title: r.data.sqlMessage });
          } else {
            mv.$swal({
              type: "success",
              title: "Contraseña cambiada exitosamente"
            });
          }
        });
    },
    
  },
  computed: {
    userList: function() {
      var mv = this.$store.state;
      return mv.users.filter(u => {
        return u.id != mv.user.id;
      });
    },
    filteredMsgs: function() {
      var mv = this.$store.state;
      return mv.mensajes.filter(msg => {
        return (
          (msg.destino == mv.selectedUser.id && msg.usuario == mv.user.id) ||
          (msg.usuario == mv.selectedUser.id && msg.destino == mv.user.id)
        );
      });
    },
    getUsers:function(){
      var mv=this
      axios.post("/getUsers").then(r=>{
        mv.$store.commit("setUsers",r)
      })
    }
  },

  mounted: function() {
    window.name = "coopechat";
    var mv = this.$store.state;
    var v = this;

    this.$notification.requestPermission().then(console.log);
    mv.sck = socketIo.connect(mv.api);

    mv.sck.on("connect", () => {
      console.log("socket conectado");
      var ses = JSON.parse(sessionStorage.getItem("user"));
      if (ses) {
        v.$store.commit("setUser", ses);
        v.entrar();
      }
    });
    mv.sck.on("mensaje", data => {
      console.log(data)
      v.$store.commit("addMsg", data);
      if (data.usuario == mv.selectedUser.id) {
        v.msgReaded(data.usuario);
      }
      if (data.usuario != mv.user.id) {
        v.notify("Te ha llegado un mensaje del usuario " + data.usuario);
      }
    });
    mv.sck.on("login", data => {
      if (data.error) {
        v.$swal({ type: "error", title: data.error });
      } else {
        v.$store.commit("setUser", data);

        sessionStorage.setItem("user", JSON.stringify(mv.user));
        v.getMsgs();
      }
    });
    mv.sck.on("refreshUsers", data => {
      v.$store.commit("setUsers", data);
      v.selectUser(v.$route.params.id);
    });
    mv.sck.on("getMsgs", data => {
      v.$store.commit("setMsgs", data);
    });
    mv.sck.on("mensajesLeidos", usuario => {
      mv.mensajes.forEach(m => {
        if (m.destino == usuario) {
          v.$set(m, "leido", 1);
        }
      });
    });
    mv.sck.on("userImgChanged", data => {
      if (data.id == mv.user.id) {
        v.$store.commit("setUserImg", data.img);
      }
      v.$store.commit("userImgChanged", data);
    });
  }
};
function resizeBase64Img(base64, width, height) {
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  var context = canvas.getContext("2d");
  var img = document.createElement("img");
  img.setAttribute("src", base64);
  var result = new Promise(resolve => {
    img.addEventListener("load", function() {
      context.scale(width / this.width, height / this.height);
      context.drawImage(this, 0, 0);
      resolve(canvas.toDataURL("JPEG", 0.8));
    });
  });

  return result;
}
</script>
<style>
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.conectado {
  color: dodgerblue;
  font-weight: bold;
}
.desconectado {
  color: #ccc;
  font-weight: normal;
}
</style>
