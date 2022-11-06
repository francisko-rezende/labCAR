import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/database';
import { GetRidersReturn } from 'src/types/getRidersResult';
import { StringUtils } from 'src/utils/stringUtils';
import { Rider } from './riders.entity';

@Injectable()
export class RidersService {
  constructor(private database: Database, private stringUtils: StringUtils) {}

  createRiders(riders: Rider[]) {
    this.database.createRiders(riders);
  }

  createRider(rider: Rider) {
    const newRider = {
      ...rider,
      cpf: this.stringUtils.removeNonNumericCharacters(rider.cpf),
      isDeleted: false,
    };

    const riders = this.database.findAllRiders();
    const hasCpfBeenRegistered = riders.some(({ cpf }) => cpf === newRider.cpf);

    if (hasCpfBeenRegistered) {
      return 'conflict';
    }

    this.database.createRider(newRider);
    return newRider;
  }

  findAllRiders(page: number, size: number, startingCharacters: string) {
    const allRiders = this.database.findAllRiders();
    const riders = startingCharacters
      ? allRiders.filter(({ name }) =>
          this.stringUtils
            .standardizeText(name)
            .startsWith(this.stringUtils.standardizeText(startingCharacters)),
        )
      : allRiders;

    const startIndex = (Number(page) - 1) * Number(size);
    const endIndex = startIndex + Number(size);

    const result: GetRidersReturn = {
      data: riders.slice(startIndex, endIndex),
    };

    if (startIndex > 0) {
      result.previous = {
        page: Number(page) - 1,
        size: size,
      };
    }

    if (endIndex < riders.length) {
      result.next = {
        page: Number(page) + 1,
        size: size,
      };
    }

    return result;
  }

  findOneRider(cpf: string) {
    const riders = this.database.findAllRiders();
    const onlyDigitsCpf = this.stringUtils.removeNonNumericCharacters(cpf);
    const searchedRider = riders.find(({ cpf }) => cpf === onlyDigitsCpf);
    return searchedRider;
  }

  updateRider(riderInfo: Rider, cpf: string) {
    const riders = this.database.findAllRiders();
    const onlyDigitsCpf = this.stringUtils.removeNonNumericCharacters(cpf);
    const checkIfMatchingCpf = (rider) => rider.cpf === onlyDigitsCpf;

    const isRiderRegistered = riders.some(checkIfMatchingCpf);

    if (!isRiderRegistered) {
      return 'not found';
    }

    const updatedRiders = riders.map((rider) => {
      const isRiderToUpdate = checkIfMatchingCpf(rider);

      return isRiderToUpdate
        ? { ...rider, ...riderInfo, cpf: onlyDigitsCpf }
        : rider;
    });

    this.database.createRiders(updatedRiders);
  }

  removeRider(cpf: string) {
    const riders = this.database.findAllRiders();
    const onlyDigitsCpf = this.stringUtils.removeNonNumericCharacters(cpf);
    const checkIfMatchingCpf = (rider) => rider.cpf === onlyDigitsCpf;

    const isRiderRegistered = riders.some(checkIfMatchingCpf);

    if (!isRiderRegistered) {
      return 'not found';
    }

    const updatedRiders = riders.filter((rider) => !checkIfMatchingCpf(rider));

    this.database.createRiders(updatedRiders);
  }
}