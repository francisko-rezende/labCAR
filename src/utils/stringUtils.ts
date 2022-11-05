import { Injectable } from '@nestjs/common';

@Injectable()
export class StringUtils {
  standardizeText(text: string) {
    return text.trim().toLowerCase();
  }

  removeNonNumericCharacters(text: string) {
    const NonNumericRegex = /\D/g;

    return text.replace(NonNumericRegex, '');
  }
}
