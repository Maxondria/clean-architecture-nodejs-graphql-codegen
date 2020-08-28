import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { SignUpEmailPasswordRequest } from 'schema/types';
import { ConflictError } from 'common/error/Conflict';

import { AuthEmailPasswordRepository } from './interface/repository';
import { SignUpEmailPasswordUseCase } from './interface/usecase';
import { SignUpEmailPasswordPresenter } from './interface/presenter';
import { UserRepository } from '../user/interface/repository';
import { encryptPassword } from '../../entity/common/Password';

dotenv.config();

export class SignUpEmailPasswordInteractor implements SignUpEmailPasswordUseCase {
  private authRepository: AuthEmailPasswordRepository;
  private userRepository: UserRepository;
  private presenter: SignUpEmailPasswordPresenter;

  constructor(
    authRepository: AuthEmailPasswordRepository,
    userRepository: UserRepository,
    presenter: SignUpEmailPasswordPresenter,
  ) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
    this.presenter = presenter;
  }

  public async handle(request: SignUpEmailPasswordRequest) {
    // すでに登録されているメールアドレスでは登録できない
    const existedAuthEntity = await this.authRepository.getByEmail(request.email);
    if (existedAuthEntity) throw new ConflictError('そのメールアドレスはすでに登録されています');

    // TODO: トランザクション

    // user エンティティを生成
    const userEntity = await this.userRepository.create({ email: request.email });
    const userId = userEntity.getId().toString();

    // auth エンティティを生成
    const passwordEncrypted = await encryptPassword(request.password);
    await this.authRepository.create({
      email: request.email,
      passwordEncrypted,
      userId,
    });

    // JWT トークンを生成
    const tokenPayload = {
      id: userId,
      roles: userEntity.getRoles().map((role) => role.toString()),
    };
    const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
    const token = jwt.sign(tokenPayload, JWT_SECRET!, { expiresIn: JWT_EXPIRES_IN });

    // TODO: ログイン履歴とか

    // JWTトークンとサインアップ済みユーザを返す
    this.presenter.output(token, userEntity);
  }
}