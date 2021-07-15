import { StandarError } from "./../../utils/errors/shemaError";
import {
  Resolver,
  ResolverInterface,
  Mutation,
  Query,
  Arg,
  Int,
} from "type-graphql";
import { Service } from "typedi";
import { Sede } from "./Sede.entity";
import { SedeInput } from "./inputSede";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server-express";
import { FindManyOptions } from "typeorm";
@Resolver()
@Service()
export class SedeResolver {
  constructor(
    @InjectRepository(Sede) private sedeRepository: Repository<Sede>
  ) {}
  @Mutation((type) => Sede)
  async createSede(@Arg("sede", (type) => SedeInput) sede: SedeInput) {
    const pre_save = this.sedeRepository.create(sede);

    return this.sedeRepository.save(pre_save);
  }
  @Mutation((type) => Sede)
  async updateSede(
    @Arg("id", (type) => Int, { nullable: false }) id: number,
    @Arg("sede", (type) => SedeInput) sede: SedeInput
  ) {
    const oldSede = await this.sedeRepository.findOne(id);
    if (oldSede) {
      const newSede = this.sedeRepository.merge(oldSede, sede);
      return await this.sedeRepository.save(newSede);
    }
    throw new StandarError(undefined, "Sede no encontrada");
  }

  @Mutation((type) => Sede)
  async deleteSede(@Arg("id", (type) => Int) id: number) {
    const oldSede = await this.sedeRepository.findOne(id);
    if (!oldSede) {
      throw new StandarError(undefined, "Sede no encontrada");
    }
    const result = await this.sedeRepository.delete(id);
    if (result?.affected) {
      return oldSede;
    } else {
      throw new ApolloError("Problema al editar la sede");
    }
  }
  // retrive sedes

  @Query((type) => [Sede])
  async sedes(@Arg("id", (type) => Int, { nullable: true }) id: number) {
    let options = {} as FindManyOptions<Sede>;
    id && (options.where = { id: id });
    return this.sedeRepository.find({});
  }
}
