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
        Repository.put(`${CONTRACT_URL}`, contract)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Update contract
    _updateContractStatus(context, { contractId, contractStatus }) {
      return new Promise((resolve, reject) => {
        Repository.patch(
          `${CONTRACT_URL}/${contractId}/status?contractStatus=${contractStatus}`
        )
          .then((res) => {
            resolve(res);
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
            console.log(
              "🚀 ~ file: Contract.js ~ line 43 ~ returnnewPromise ~ err",
              err
            );
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
            resolve(res.data.contractList);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Get contracts list
    _getContractDetail(context, contractId) {
      return new Promise((resolve, reject) => {
        Repository.get(`${CONTRACT_URL}/${contractId}`)
          .then((res) => {
            resolve(res.data.contractDetail);
          })
          .catch((err) => {
            console.log(err);
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
    // Get contract vehicle list
    _getContractVehicle(context, contractId) {
      return new Promise((resolve, reject) => {
        Repository.get(`${CONTRACT_URL}/vehicles?contractTripId=${contractId}`)
          .then((res) => {
            resolve(res.data.contractVehicleList);
          })
          .catch((err) => {
            console.log(err);
            reject(err.response.data);
          });
      });
    },
    // Assign Vehicle For Contract
    _assignVehicleForContract(context, contract) {
      return new Promise((resolve, reject) => {
        Repository.post(`${CONTRACT_URL}/vehicles`, contract)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Update trip
    _updateContractTrip(context, contract) {
      return new Promise((resolve, reject) => {
        Repository.patch(`${CONTRACT_URL}/trip`, contract)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // Update trip
    _updateContractLocation(context, location) {
      return new Promise((resolve, reject) => {
        Repository.patch(`${CONTRACT_URL}/schedule`, location)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // get recommendation vehicles
    _getAvailableVehiclesAuto(
      context,
      {
        startDate,
        endDate,
        bufferPre,
        bufferPost,
        passengerCount,
        vehicleCount,
        ignoreSleeperBus,
      }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${CONTRACT_URL}/vehicles/available-vehicles/auto?endDate=${endDate}&startDate=${startDate}&bufferPre=${bufferPre}&bufferPost=${bufferPost}&passengerCount=${passengerCount}&vehicleCount=${vehicleCount}&ignoreSleeperBus=${ignoreSleeperBus}`
        )
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // get recommendation vehicles
    _getVehicleRecommendations(
      context,
      {
        startDate,
        endDate,
        seatsMin,
        seatsMax,
        vehicleTypeId,
        viewOption,
        bufferPre,
        bufferPost,
        pageNum,
      }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${CONTRACT_URL}/vehicles/available-vehicles?endDate=${endDate}&seatsMax=${seatsMax}&seatsMin=${seatsMin}&startDate=${startDate}&vehicleTypeId=${vehicleTypeId}&viewOption=${viewOption}&bufferPost=${bufferPost}&bufferPre=${bufferPre}&pageNum=${pageNum}`
        )
          .then((res) => {
            resolve(res.data.vehicleList);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    // get recommendation vehicles count
    _getVehicleRecommendationsCount(
      context,
      {
        startDate,
        endDate,
        seatsMin,
        seatsMax,
        vehicleTypeId,
        viewOption,
        bufferPre,
        bufferPost,
      }
    ) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${CONTRACT_URL}/vehicles/available-vehicles/count?endDate=${endDate}&seatsMax=${seatsMax}&seatsMin=${seatsMin}&startDate=${startDate}&vehicleTypeId=${vehicleTypeId}&viewOption=${viewOption}&bufferPost=${bufferPost}&bufferPre=${bufferPre}`
        )
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },

    // Get passengers list
    _getPassengerList(context, contractVehicleId) {
      return new Promise((resolve, reject) => {
        Repository.get(
          `${CONTRACT_URL}/vehicles/passengers?contractVehicleId=${contractVehicleId}`
        )
          .then((res) => {
            resolve(res.data.passengerList);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
  },
};
