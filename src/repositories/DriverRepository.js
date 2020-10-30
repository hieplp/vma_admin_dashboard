import Repository from "./Repository";

const resource = "/drivers";

export default {
  // Get driver list
  async get(page, name, phoneNumber, userStatus, userId, viewOption) {
    let driverList = [];
    try {
      const res = await Repository.get(
        `${resource}?name=${name}&page=${page}&phoneNumber=${phoneNumber}&userStatus=${userStatus}&userId=${userId}&viewOption=${viewOption}`
      );
      if (res.data) {
        driverList = res.data.driverRes;
      }
    } catch (ex) {
      console.log(ex);
    }
    return driverList;
  },
  // Get total drivers count
  async getTotalDriver(name, phoneNumber, userStatus, userId, viewOption) {
    let count = 0;
    try {
      const res = await Repository.get(
        `${resource}/count?name=${name}&phoneNumber=${phoneNumber}&userStatus=${userStatus}&userId=${userId}&viewOption=${viewOption}`
      );
      if (res.data) {
        count = res.data;
      }
    } catch (ex) {
      console.log(ex);
    }
    return count;
  },
  // Get detailed driver
  getDetailDriver(userId) {
    return new Promise((resolve, reject) => {
      Repository.get(`${resource}/${userId}`)
        .then((res) => {
          resolve(res.data.driverDetail);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Create driver
  create(driver) {
    // driver = {
    //   address: "32132131231, Xã Thụy Dân, Huyện Thái Thụy, Tỉnh Thái Bình",
    //   baseSalary: "31232132131",
    //   dateOfBirth: "2020-10-08",
    //   fullName: "2412fd12r212",
    //   gender: true,
    //   imageLink:
    //     "https://firebasestorage.googleapis.com/v0/b/vma-fa20se28.appspot.com/o/profile-412541251251-20201031013846?alt=media&token=b2656c61-eca3-4292-a3b0-36f3a5b67d82",
    //   password: "3123213",
    //   phoneNumber: "0412541412",
    //   userDocumentReqList: [
    //     {
    //       documentImagesReqList: [
    //         {
    //           imageLink: "string",
    //           userDocumentImageId: 0,
    //         },
    //       ],
    //       expiryDate: "2030-10-07",
    //       otherInformation: "string",
    //       registeredDate: "2020-10-07",
    //       registeredLocation: "Tỉnh Nam Định",
    //       userDocumentId: "412541251251",
    //       userDocumentType: "IDENTITY_CARD",
    //     },
    //   ],
    //   userId: "412541251251",
    // };
    // driver = {
    //   address: "321321321321, Xã Liên Sơn, Huyện Kim Bảng, Tỉnh Hà Nam",
    //   baseSalary: "312321321",
    //   dateOfBirth: "2020-10-10",
    //   fullName: "312321321",
    //   gender: true,
    //   imageLink:
    //     "https://firebasestorage.googleapis.com/v0/b/vma-fa20se28.appspot.com/o/profile-321421421424-20201031020317?alt=media&token=7aaf85ef-10ad-4572-82bb-84bbd61ce159",
    //   password: "321321321",
    //   phoneNumber: "0321312332",
    //   userDocumentReqList: [
    //     {
    //       documentImagesReqList: [
    //         {
    //           imageLink:
    //             "https://firebasestorage.googleapis.com/v0/b/vma-fa20se28.appspot.com/o/indentifyImage-321421421424-20201031020320?alt=media&token=f79bb551-b43f-43d8-b1c7-7ca64024bdc9",
    //           userDocumentImageId: 0,
    //         },
    //         {
    //           imageLink:
    //             "https://firebasestorage.googleapis.com/v0/b/vma-fa20se28.appspot.com/o/indentifyImage-321421421424-20201031020320?alt=media&token=f79bb551-b43f-43d8-b1c7-7ca64024bdc9",
    //           userDocumentImageId: 0,
    //         },
    //       ],
    //       expiryDate: "2030-10-10",
    //       otherInformation: "",
    //       registeredDate: "2020-10-10",
    //       registeredLocation: "Tỉnh Nam Định",
    //       userDocumentId: "321421421424",
    //       userDocumentType: "IDENTITY_CARD",
    //     },
    //     {
    //       expiryDate: "2021-10-10",
    //       otherInformation: "",
    //       registeredDate: "2020-10-10",
    //       registeredLocation: "Tỉnh Hoà Bình",
    //       userDocumentId: "412421421421421",
    //       userDocumentType: "HEALTH_INSURANCE",
    //       documentImagesReqList: [
    //         {
    //           imageLink:
    //             "https://firebasestorage.googleapis.com/v0/b/vma-fa20se28.appspot.com/o/healthInsuranceImage-321421421424-20201031020328?alt=media&token=920d869d-d2ea-47f4-8b22-ac95db13d5c3",
    //           userDocumentImageId: 0,
    //         },
    //         {
    //           imageLink:
    //             "https://firebasestorage.googleapis.com/v0/b/vma-fa20se28.appspot.com/o/healthInsuranceImage-321421421424-20201031020328?alt=media&token=920d869d-d2ea-47f4-8b22-ac95db13d5c3",
    //           userDocumentImageId: 0,
    //         },
    //       ],
    //     },
    //     {
    //       expiryDate: "2025-10-10",
    //       otherInformation: "D",
    //       registeredDate: "2020-10-10",
    //       registeredLocation: "Tỉnh Thái Bình",
    //       userDocumentId: "421521521512",
    //       userDocumentType: "DRIVING_LICENSE",
    //       documentImagesReqList: [
    //         {
    //           imageLink:
    //             "https://firebasestorage.googleapis.com/v0/b/vma-fa20se28.appspot.com/o/drivingLicenseImage-321421421424-20201031020336?alt=media&token=71c80ae4-58c1-4357-9d87-2db36e845c06",
    //           userDocumentImageId: 0,
    //         },
    //         {
    //           imageLink:
    //             "https://firebasestorage.googleapis.com/v0/b/vma-fa20se28.appspot.com/o/drivingLicenseImage-321421421424-20201031020336?alt=media&token=71c80ae4-58c1-4357-9d87-2db36e845c06",
    //           userDocumentImageId: 0,
    //         },
    //       ],
    //     },
    //   ],
    // };
    // console.log(123123);
    return new Promise((resolve, reject) => {
      Repository.post(resource, driver)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err.response.data);
        });
    });
  },
  // Create driver
  update(driver) {
    return new Promise((resolve, reject) => {
      Repository.put(resource, driver)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
  // Delete driver
  delete(userId) {
    return new Promise((resolve, reject) => {
      Repository.delete(`${resource}?userId=${userId}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.response.data);
        });
    });
  },
};
