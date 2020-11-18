import Repository from "../../repositories/Repository";
const REPORT_URL = "/reports";
export default {
  namespaced: true,
  state: {},
  mutations: {},

  actions: {
    // Get vehicles report
    // eslint-disable-next-line no-unused-vars
    _getVehiclesReport(context, { quarter, vehicleId, year }) {
      return new Promise((resolve, reject) => {
        console.log();
        Repository.get(`${REPORT_URL}/vehicles?quarter=${quarter}&year=${year}`)
          .then((res) => {
            var file = new Blob([res.data]);
            resolve(file);
            // resolve(res.data);
            // let file = new File([res.data], "test", { type: blob.type });
            // console.log("_getVehiclesReport -> file", file.data);
            // resolve(file);
          })
          .catch((err) => {
            console.log(err);
            reject(err.response.data);
          });
      });
    },
  },
};
