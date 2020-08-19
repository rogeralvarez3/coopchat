<template>
  <v-app>
    <v-container>
      <v-card min-width="400">
        <v-card-title class="grey lighten-4">
          &nbsp;{{ remoteUser.nombre }}
          <v-spacer></v-spacer>
          <v-btn fab color="success" small class="elevation-2" @click="uploadFile()">
            <v-icon>mdi-paperclip</v-icon>
          </v-btn>
          <v-btn fab color="error" dark small @click="cerrarChat()" class="elevation-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-1">
          <div style="height:500px;overflow-y:scroll;" ref="mensajes">
            <div v-for="msg in mensajes" :key="msg.id" class="msg">
              <div width="40px" class="td">
                <v-avatar small class="elevation-1">
                  <img
                    :src="getImgProfile(msg.usuario)"
                    alt="."
                    v-if="getImgProfile(msg.usuario).length>0"
                  />
                  <v-icon large v-else>mdi-account</v-icon>
                </v-avatar>&nbsp;
              </div>
              <div class="td">
                <div :class="msg.usuario == user.id ? 'globitoL' : 'globitoR'">
                  <span style="font-size:10px;color:#555">
                    {{
                    new Date(msg.fecha).toLocaleDateString() +
                    " - " +
                    new Date(msg.fecha).toLocaleTimeString()
                    }}
                  </span>
                  <br />
                  <strong>
                    {{
                    msg.usuario != user.id ? remoteUser.nombre : "Tu: "
                    }}
                  </strong>
                  <div v-if="msg.tipo == 1">{{ msg.msg }}</div>
                  <div v-if="msg.tipo > 1">
                    <v-btn
                      small
                      color="primary"
                      text
                      :href="$store.state.api + '/uploads/' + msg.msg"
                    >
                      <v-icon large>{{getIcon(msg.msg)}}</v-icon>
                    </v-btn>
                  </div>
                  <v-icon
                    v-if="msg.usuario == user.id"
                    :color="msg.leido == 1 ? 'blue' : '#bbb'"
                    small
                  >mdi-check-all</v-icon>
                </div>
              </div>
              <div class="td">
                <v-btn icon text>
                  <v-icon color="grey lighten-1">mdi-dots-vertical</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-text-field
            prepend-inner-icon="mdi-chat"
            append-icon="mdi-send"
            outlined
            label="Escriba aquí el mensaje"
            clearable
            solo
            @click:append="enviar"
            v-model="miMsg"
            @keypress.enter="enviar"
          ></v-text-field>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import Axios from "axios";
export default {
  data() {
    return {
      miMsg: "",
      icons: [
        { ext: "pdf", icon: "mdi-file-pdf" },
        { ext: "doc,docx", icon: "mdi-file-word" },
        { ext: "bmp,png,jpg,gif", icon: "mdi-file-image" },
        { ext: "xls,xlsx,csv,xlsm", icon: "mdi-file-excel" },
        { ext: "ppt,pptx", icon: "mdi-file-powerpoint" },
        { ext: "txt", icon: "mdi-note-text" },
        { ext: "avi,mp4,mpg,mkv,mov,wmv", icon: "mdi-file-video" },
        { ext: "wma,mp3,m4a,wav", icon: "mdi-file-music" },
        { ext: "zip,rar,tar,7zip,cab", icon: "mdi-package-variant-closed" }
      ]
    };
  },
  computed: {
    user: function() {
      return this.$store.state.user;
    },
    mensajes: function() {
      var mv = this
      return mv.$store.state.mensajes.filter(m=>{
        return m.destino==mv.$store.state.selectedUser.id || mv.usuario==mv.$store.state.selectedUser.id
      });
    },
    remoteUser: function() {
      return this.$store.state.selectedUser;
    }
  },
  methods: {
    enviar: function(evt) {
      var mv = this;
      mv.$store.commit("sendMsg", mv.miMsg);
      mv.miMsg = "";
    },
    desplazar: function() {
      var elem = this.$refs.mensajes;
      elem.scrollTop = elem.scrollHeight;
    },
    cerrarChat: function() {
      this.$store.commit("selectUser", {
        id: 0,
        nombre: "",
        correo: "",
        img: "",
        conectado: 0
      });
      this.$router.push("/");
    },
    uploadFile: function() {
      var mv = this;
      var input = document.createElement("input");
      input.setAttribute("type", "file");
      input.addEventListener("change", function() {
        var fr = new FileReader();
        fr.addEventListener("load", e => {
          //console.log(input.files[0].name);
          var data = {
            usuario: mv.$store.state.user.id,
            destino: mv.$store.state.selectedUser.id,
            mensaje: e.target.result.split(",")[1],
            ext: input.files[0].name.split(".")[1],
            tipo: 2
          };
          Axios.post(mv.$store.state.api + "/upload", data);
        });
        fr.readAsDataURL(input.files[0]);
      });
      input.click();
    },
    getIcon: function(fileName) {
      var mv = this;
      var ext = fileName.split(".")[fileName.split(".").length - 1].trim();
      var result = mv.icons.filter(i => {
        return i.ext.includes(ext.toString().toLowerCase());
      });
      if (result.length > 0) {
        return result[0].icon;
      } else {
        return "mdi-file";
      }
    },
    getImgProfile: function(usuario) {
      var mv = this;
      var result = "";
      if (usuario == mv.$store.state.user.id) {
        result = mv.$store.state.user.imagen;
      } else {
        result = mv.$store.state.selectedUser.imagen;
      }
      if (!result) {
        result = "";
      }
      return result;
    }
  },
  updated: function() {
    this.desplazar();
  },

  mounted: function() {
    this.desplazar();
  }
};
</script>

<style>
.td {
  display: inline-block;
  vertical-align: middle;
}
.msg {
  width: 98%;
}
.globitoL,
.globitoR {
  padding: 6px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 10px;
  color: black;
  box-shadow: 1px 1px 2px #ddd;
  text-shadow: 1px 1px 1px white;
  border-top-left-radius: 0;
  vertical-align: text-top;
}
.globitoR {
  background-image: linear-gradient(to top, rgb(188, 220, 253) 0%, white 100%);
}
.globitoL {
  background-image: linear-gradient(to top, rgb(201, 247, 201) 0%, white 100%);
}
.td .globitoL .strong,
.td .globitoL .div,
.td .globitoL .span,
.td .globitoR .strong,
.td .globitoR .div,
.td .globitoR .span {
  display: inline-block;
}
</style>
