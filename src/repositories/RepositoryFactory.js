import DriverRepository from "./DriverRepository";
import ContributorRepository from "./ContributorRepository";
import UserStatusRepository from "./UserStatusRepository";

const repositories = {
  drivers: DriverRepository,
  contributors: ContributorRepository,
  userStatus: UserStatusRepository,
};

export const RepositoryFactory = {
  get: (name) => repositories[name],
};
