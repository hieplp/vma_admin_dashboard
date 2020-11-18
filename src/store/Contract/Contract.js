import Repository from "../../repositories/Repository";
const CONTRACT_URL = "/contracts";
export default {
  namespaced: true,
  state: {},
  mutations: {},

  actions: {
    // Update contract
    _updateContract(context, contract) {
      return new Promise((resolve, reject) => {
        Repository.patch(CONTRACT_URL, contract)
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Create contract
    _create(context, contract) {
      return new Promise((resolve, reject) => {
        Repository.post(CONTRACT_URL, contract)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // get contracts
    _getContracts(
      context,
      {
        contractStatus,
        departureLocation,
        departureTime,
        destinationLocation,
        destinationTime,
        durationFrom,
        durationTo,
        pageNum,
        totalPriceMax,
        totalPriceMin,
        viewOption,
      }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${CONTRACT_URL}?contractStatus=${contractStatus}&departureLocation=${departureLocation}&departureTime=${departureTime}&destinationLocation=${destinationLocation}&destinationTime=${destinationTime}&durationFrom=${durationFrom}&durationTo=${durationTo}&pageNum=${pageNum}&totalPriceMax=${totalPriceMax}&totalPriceMin=${totalPriceMin}&viewOption=${viewOption}`
        )
          .then((res) => {
            console.log(res);
            resolve(res.data.contractList);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // get contracts count
    _getContractsCount(
      context,
      {
        contractStatus,
        departureLocation,
        departureTime,
        destinationLocation,
        destinationTime,
        durationFrom,
        durationTo,
        totalPriceMax,
        totalPriceMin,
        viewOption,
      }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${CONTRACT_URL}/count?contractStatus=${contractStatus}&departureLocation=${departureLocation}&departureTime=${departureTime}&destinationLocation=${destinationLocation}&destinationTime=${destinationTime}&durationFrom=${durationFrom}&durationTo=${durationTo}&totalPriceMax=${totalPriceMax}&totalPriceMin=${totalPriceMin}&viewOption=${viewOption}`
        )
          .then((res) => {
            console.log(res);
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // get contracts by date TODO: FIXXXXXXXXXXX
    // eslint-disable-next-line no-unused-vars
    _getContractsByDate(context, { departureTimeFrom, departureTimeTo }) {
      return new Promise((resolve, reject) => {
        Repository.get(`${CONTRACT_URL}?departureTime=${departureTimeFrom}`)
          .then((res) => {
            resolve(res.data.contractList);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
  },
};
