<template>
  <div>
    <v-dialog v-model="dlg" width="400" persistent>
      <v-card>
        <v-card-title class="blue-grey lighten-5 blue-grey--text">
          <h2>
            <v-icon color="blue-grey" large>mdi-account-card-details</v-icon
            >&nbsp;Identifíquese
          </h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            v-model="user.correo"
            label="Nombre de usuario"
            prepend-inner-icon="mdi-account"
            @keypress.13="$refs.txtP.focus()"
          ></v-text-field>
          <v-text-field
            ref="txtP"
            v-model="user.pass"
            label="Contraseña"
            prepend-inner-icon="mdi-key"
            :type="showPass ? 'text' : 'password'"
            @keypress.13="entrar()"
            @click:append="showPass = !showPass"
            :append-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                text
                color="primary"
                @click="dlgRecoverPass = true"
                v-on="on"
              >
                <v-icon>mdi-account-key</v-icon>
              </v-btn>
            </template>
            <span>Recuperar contraseña</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn v-if="
                  $store.state.user.correo.length > 0 &&
                    $store.state.user.pass.length > 0"
                icon
                dark
                color="blue-grey darken-3"
                @click="entrar()"
                v-on="on"
              >
                <v-icon>mdi-lock-open</v-icon>
              </v-btn>
              <v-btn v-else icon>
              <v-icon  color="grey"
                >mdi-lock-open</v-icon>
          </v-btn>
            </template>
            <span>Entrar al chat</span>
          </v-tooltip>
          
          
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dlgRecoverPass" width="400">
      <v-card>
        <v-card-title>
          Recuperar contraseña
          <v-spacer></v-spacer>
          <v-btn text icon @click="dlgRecoverPass = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            v-model="correo"
            type="email"
            label="Correo"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="forgotPass()">enviar</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="cargando" width="150" persistent>
      <v-card>
        <v-card-text>
          <v-flex row>
          </v-flex>
          <h3>ESPERE...</h3>
          <v-icon large>mdi-mail-ru mdi-spin</v-icon>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  props: {
    user: Object
  },
  data() {
    return { showPass: false, dlgRecoverPass: false, correo: "",cargando:false };
  },
  methods: {
    entrar: function() {
      this.$emit("entrar");
    },
    forgotPass: function() {
      var mv = this;
      mv.cargando=true
      if (mv.correo.length > 0) {
        axios
          .post(mv.$store.state.api + "/recuperarPass", {
            usuario: mv.correo
          })
          .then(r => {
            mv.cargando=false
            if (r.data.errno) {
              console.log(r.data);
              mv.$swal({
                type: "error",
                title: "Error al enviar correo",
                text: r.data
              });
            } else {
              mv.$swal({
                type: "success",
                title: "Correo enviado",
                html:
                  "Se ha enviado la contraseña a su buzón de correo, favor revisar <a href='http://correo.coopefacsa.coop'>aquí</a>"
              });
              mv.dlgRecoverPass = false;
            }
          });
      }
    }
  },
  computed: {
    dlg: function() {
      return this.$store.state.user.id == 0;
    }
  }
};
</script>
<style scoped>
  .cargando{padding: 10px;}
</style>
