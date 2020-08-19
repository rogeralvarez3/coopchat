import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sck: {},
    user: {
      id: 0,
      nombre: "",
      pass: "",
      correo: "",
      imagen: ""
    },
    users: [],
    selectedUser: { id: 0, nombre: "", correo: "", imagen: "", conectado: 0 },
    mensajes: [],
    api: ""
  },
  mutations: {
    selectUser: function(state, payload) {
      Object.keys(payload).forEach(k => {
        Vue.set(state.selectedUser, k, payload[k]);
      });
    },
    setUserImg: function(state, payload) {
      state.user.imagen = payload;
    },
    setUser: function(state, payload) {
      Object.keys(payload).forEach(k => {
        Vue.set(state.user, k, payload[k]);
      });
    },
    setUsers: function(state, payload) {
      state.users = payload;
    },
    setMsgs: function(state, payload) {
      state.mensajes = payload;
    },
    addMsg: function(state, payload) {
      state.mensajes.push(payload);
    },
    setMsgReaded: function(state, u) {
      state.mensajes.forEach(m => {
        if (m.usuario == u) {
          Vue.set(m, "leido", 1);
        }
        if (!state.sck) {
          return;
        }
        state.sck.emit("msgReaded", { destino: state.user.id, origen: u });
      });
    },
    sendMsg: function(state, payload) {
      var data = {
        usuario: state.user.id,
        msg: payload,
        destino: state.selectedUser.id
      };
      console.log(payload);
      state.sck.emit("mensaje", data);
    },
    userUpdated: function(state, payload) {
      var i = state.users.findIndex(u => {
        return u.id == payload.id;
      });
      Vue.set(state.users, i, payload);
    },
    userImgChanged: function(state, payload) {
      var i = state.users.findIndex(u => {
        return u.id == payload.id;
      });
      Vue.set(state.users[i], "imagen", payload.img);
      sessionStorage.setItem("user", JSON.stringify(state.user));
    }
  },
  actions: {}
});
