import { SetMetadata } from '@nestjs/common';
import { Authorities } from './authorities';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Authorities[]) => SetMetadata(ROLES_KEY, roles);
