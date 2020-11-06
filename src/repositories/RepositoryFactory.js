import DriverRepository from "./DriverRepository";
import ContributorRepository from "./ContributorRepository";
import UserStatusRepository from "./UserStatusRepository";
import UserRepository from "./UserRepository";
import VehicleRepository from "./VehicleRepository";
import DocumentRepository from "./DocumentRepository";
import VehicleDocumentRepository from "./VehicleDocumentRepository";
import CustomerRepository from "./CustomerRepository";
import ContractRepository from "./ContractRepository";

const repositories = {
  drivers: DriverRepository,
  contributors: ContributorRepository,
  userStatus: UserStatusRepository,
  users: UserRepository,
  vehicles: VehicleRepository,
  documents: DocumentRepository,
  customers: CustomerRepository,
  vehicleDocument: VehicleDocumentRepository,
  contracts: ContractRepository,
};

export const RepositoryFactory = {
  get: (name) => repositories[name],
};
