import DriverRepository from "./DriverRepository";
import ContributorRepository from "./ContributorRepository";
import UserStatusRepository from "./UserStatusRepository";
import UserRepository from "./UserRepository";
import VehicleRepository from "./VehicleRepository";

const repositories = {
  drivers: DriverRepository,
  contributors: ContributorRepository,
  userStatus: UserStatusRepository,
  users: UserRepository,
  vehicles: VehicleRepository,
};

export const RepositoryFactory = {
  get: (name) => repositories[name],
};
