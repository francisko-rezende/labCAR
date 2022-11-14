import { Injectable } from '@nestjs/common';
import { Database } from 'src/database/database';
import { FindAllRidersResult } from 'src/types/findAllRidersResult';
import { StringUtils } from 'src/utils/stringUtils';
import { Rider } from './riders.entity';

@Injectable()
export class RidersService {
  constructor(private database: Database, private stringUtils: StringUtils) {}

  createRiders(riders: Rider[]) {
    this.database.saveRiders(riders);
  }

  createRider(rider: Rider): Rider | 'conflict' {
    const newRider: Rider = {
      ...rider,
      cpf: this.stringUtils.removeNonNumericCharacters(rider.cpf),
    };

    const riders = this.database.findAllRiders();
    const hasCpfBeenRegistered = riders.some(({ cpf }) => cpf === newRider.cpf);

    if (hasCpfBeenRegistered) {
      return 'conflict';
    }

    this.database.saveRider(newRider);
    return newRider;
  }

  findAllRiders(
    page: number,
    size: number,
    startingCharacters: string,
  ): FindAllRidersResult {
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

    const result: FindAllRidersResult = {
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
    const isCpfRegistered = riders.some(
      (rider) =>
        this.stringUtils.removeNonNumericCharacters(riderInfo.cpf) ===
        rider.cpf,
    );
    const isOwnCpf =
      onlyDigitsCpf ===
      this.stringUtils.removeNonNumericCharacters(riderInfo.cpf);

    if (isCpfRegistered && !isOwnCpf) {
      return 'conflict';
    }

    if (!isRiderRegistered) {
      return 'not found';
    }

    const updatedRiders = riders.map((rider) => {
      const isRiderToUpdate = checkIfMatchingCpf(rider);

      return isRiderToUpdate
        ? {
            ...rider,
            ...riderInfo,
            cpf: this.stringUtils.removeNonNumericCharacters(riderInfo.cpf),
          }
        : rider;
    });

    this.database.saveRiders(updatedRiders);
    return updatedRiders.find(
      ({ cpf }) =>
        cpf === this.stringUtils.removeNonNumericCharacters(riderInfo.cpf),
    );
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

    this.database.saveRiders(updatedRiders);
  }
}
