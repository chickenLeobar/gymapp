import { Schedule } from "./../entities/Schedule.entity";
import { StandarError } from "./../../../utils/errors/shemaError";
import { Resolver, Mutation, Arg, Int } from "type-graphql";
import { Service } from "typedi";
import { Clase } from "../entities/clase.entity";
import { InputClase } from "../inputs/clase.input";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server-express";
@Resolver()
@Service()
export class ClaseResolver {
  constructor(
    @InjectRepository(Clase) private claseRepository: Repository<Clase>
  ) {}

  @Mutation((type) => Clase)
  async createClase(@Arg("clase", (type) => InputClase) clase: InputClase) {
    const pre_save = this.claseRepository.create(clase);
    pre_save.schedule = Object.assign([] as Schedule[], clase.schedules);
    console.log("test pre _ save");
    console.log(pre_save);

    return this.claseRepository.save(pre_save);
  }

  @Mutation((type) => Clase)
  async updateClase(
    @Arg("id", (type) => Int, { nullable: false }) id: number,
    @Arg("clase", (type) => InputClase) clase: InputClase
  ) {
    const bdClase = await this.claseRepository.findOne(id);
    if (bdClase) {
      const newClase = this.claseRepository.merge(bdClase, clase);
      return await this.claseRepository.save(newClase);
    }
    throw new StandarError(undefined, "clase no encontrada");
  }

  @Mutation((type) => Clase)
  async deleteClase(@Arg("id", (type) => Int) id: number) {
    const oldClase = await this.claseRepository.findOne(id);
    if (!oldClase) {
      throw new StandarError(undefined, "clase no encontrada");
    }
    const result = await this.claseRepository.delete(id);
    if (result?.affected) {
      return oldClase;
    } else {
      throw new ApolloError("clase no encontrada");
    }
  }
}
