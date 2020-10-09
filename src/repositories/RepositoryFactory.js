import DriverRepository from "./DriverRepository";
import ContributorRepository from "./ContributorRepository";

const repositories = {
  drivers: DriverRepository,
  contributors: ContributorRepository,
};

export const RepositoryFactory = {
  get: (name) => repositories[name],
};
