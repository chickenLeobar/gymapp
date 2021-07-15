import { StandarError } from "./../../utils/errors/shemaError";
import { Resolver, Mutation, Arg, Int, Query } from "type-graphql";
import { Service } from "typedi";
import { Plan } from "./Plan.entity";
import { InputPlan } from "./plan.input";
import { Repository, FindManyOptions } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server-express";
@Resolver()
@Service()
export class PlanResolver {
  constructor(
    @InjectRepository(Plan) private planRepository: Repository<Plan>
  ) {}
  @Mutation((type) => Plan)
  async createPlan(@Arg("plan", (type) => InputPlan) plan: InputPlan) {
    const pre_save = this.planRepository.create(plan);
    return this.planRepository.save(pre_save);
  }
  @Mutation((type) => Plan)
  async updatePlan(
    @Arg("id", (type) => Int, { nullable: false }) id: number,
    @Arg("plan", (type) => InputPlan) plan: InputPlan
  ) {
    const bdPlan = await this.planRepository.findOne(id);
    if (bdPlan) {
      const newPlan = this.planRepository.merge(bdPlan, plan);
      return await this.planRepository.update(id, newPlan);
    }
    throw new StandarError(undefined, "plan no encontrado");
  }

  @Mutation((type) => Plan)
  async deletePlan(@Arg("id", (type) => Int) id: number) {
    const oldPlan = await this.planRepository.findOne(id);
    if (!oldPlan) {
      throw new StandarError(undefined, "plan no encontrado");
    }
    const result = await this.planRepository.delete(id);
    if (result?.affected) {
      return oldPlan;
    } else {
      throw new ApolloError("plan no encontrado");
    }
  }

  @Query((type) => [Plan])
  async retrievePlans(
    @Arg("id", (type) => Int, { nullable: true }) id: number
  ) {
    let filters = {} as FindManyOptions<Plan>;
    if (id) {
      filters.where = { id };
    }
    return this.planRepository.find(filters);
  }
}
