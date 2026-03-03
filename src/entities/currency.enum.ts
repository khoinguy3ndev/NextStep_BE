import { registerEnumType } from '@nestjs/graphql';

export enum Currency {
  VND = 'VND',
  USD = 'USD',
}

registerEnumType(Currency, {
  name: 'Currency',
});
