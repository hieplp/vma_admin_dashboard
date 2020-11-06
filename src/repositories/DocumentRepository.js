import Repository from "./Repository";

const adminResource = "/admin/documents";

export default {
  // Update document
  update(document, userId) {
    console.log(document);
    return new Promise((resolve, reject) => {
      Repository.put(`${adminResource}/users?userId=${userId}`, document)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
};
