import { AddressType } from '../enums/addressType';


export interface LoginResponse {
  accessToken: string,
  refreshToken: string,
  id: number,
  email: string,
  profileImageUrl: string,
  nickName: string,
  addresses: Array<UserAddressDto>
  authorities: [
    string
  ],
  notAgreementTerms: Array<TermsDto>,
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAddressDto {
  id: number,
  addressName: string,
  detailAddress: string,
  zoneNo: string,
  longitude: number,
  latitude: number,
  addressType: AddressType
}


export interface TermsDto {

  id: number;
  termsDetailId: number;
  termOrder: number;
  name: string;
  required: boolean;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;

}
