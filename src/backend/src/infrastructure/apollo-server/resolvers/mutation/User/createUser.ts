import { MutationResolvers } from 'schema';
import { CreateUserInteractor } from 'domain-model';

import { ApolloServerContext } from '../../../types';
import { GqlUserRepository } from '../../../../../repository/typeorm/user/repository/User';
import { GqlCreateUserPresenter } from '../../../../../presenter/user/CreateUser';

export const createUser: MutationResolvers<ApolloServerContext> = {
  createUser: async (_parent, args, { dbConnection }) => {
    const repository = new GqlUserRepository(dbConnection);
    const presenter = new GqlCreateUserPresenter();
    const usecase = new CreateUserInteractor(repository, presenter);

    await usecase.handle(args.input!);

    return presenter.getResponse();
  },
};
