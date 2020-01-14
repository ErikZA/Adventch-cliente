import { AbstractControl } from '@angular/forms';

export class CustomValidators {

  static MatchPassword(AC: AbstractControl) {
    const password = AC.get('new').value; // to get value in input tag
    const confirmPassword = AC.get('confirm').value; // to get value in input tag
     if (password !== confirmPassword) {
        console.log('false');
        AC.get('confirm').setErrors( { MatchPassword: true } );
     } else {
         console.log('true');
         return null;
     }
  }

  static cpfCnpjValidator(ctrl) {
    if (!CustomValidators.cnpjValidator(ctrl.value) && !CustomValidators.cpfValidator(ctrl.value)) {
      return { validcpfCnpj: true };
    }
    return null;
  }

  static nullableCpfCnpjValidator(ctrl) {
    if (!ctrl.value) {
      return true;
    } else
      if (!CustomValidators.cnpjValidator(ctrl.value) && !CustomValidators.cpfValidator(ctrl.value)) {
        return { validcpfCnpj: true };
      }
    return null;
  }

  static cnpjValidator(cnpj: string): boolean {
    if (!cnpj || cnpj.length < 14) {
      return false;
    }
    cnpj = cnpj.replace(/[^\d]/g, '');
    if (cnpj.length !== 14) {
      return false;
    }
    if (cnpj.split('').every(c => c === cnpj[0])) {
      return false;
    }
    const lst = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let dig1 = 0;
    let dig2 = 0;
    for (let i = 0; i < lst.length; i++) {
      dig1 += (i > 0 ? (parseInt(cnpj.charAt(i - 1)) * lst[i]) : 0);
      dig2 += parseInt(cnpj.charAt(i)) * lst[i];
    }
    dig1 = (dig1 % 11 < 2) ? 0 : (11 - (dig1 % 11));
    dig2 = (dig2 % 11 < 2) ? 0 : (11 - (dig2 % 11));
    const dig = parseInt(cnpj.charAt(12)) + parseInt(cnpj.charAt(13));
    return dig1 + dig2 === dig;
  }

  static cpfValidator(cpf: string): boolean {
    if (!cpf || cpf.length < 11) {
      return false;
    }
    cpf = cpf.replace(/[^\d]+/g, '');
    if (!cpf || cpf.length !== 11) {
      return false;
    }
    if (cpf.split('').every(c => c === cpf[0])) {
      return false;
    }
    let add1 = 0;
    for (let i = 0; i < 9; i++) {
      add1 += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let rev = 11 - (add1 % 11);
    if (rev === 10 || rev === 11) {
      rev = 0;
    }
    if (rev !== parseInt(cpf.charAt(9))) {
      return false;
    }
    let add2 = 0;
    for (let i = 0; i < 10; i++) {
      add2 += parseInt(cpf.charAt(i)) * (11 - i);
    }
    rev = 11 - (add2 % 11);
    if (rev === 10 || rev === 11) {
      rev = 0;
    }
    if (rev !== parseInt(cpf.charAt(10))) {
      return false;
    }
    return true;
  }

  static cepValidator(cep) {
    let cepValue: string = cep.value;

    if (!cepValue) {
      return null;
    } else {
      cepValue = cepValue.replace(/[^\d]/g, '');
    }

    if (cepValue.length !== 8) {
      return { invalidCep: true };
    }

    // for (let i = 0; i < CustomValidators.cep.length; i++)
    //  if (cepValue >= CustomValidators.cep[i][1] && cepValue <= CustomValidators.cep[i][2])
    //    return null;

    return { invalidCep: true };
  }


  // static cep: Array<any[]> = [
  //   ['Abatiá', 86460000, 86460970],
  //   ['Alvorada do Sul', 86150000, 86155970],
  //   ['Andirá', 86380000, 86383990],
  //   ['Assaí', 86220000, 86224970],
  //   ['Bandeirantes', 86360000, 86365970],
  //   ['Barra Do Jacaré', 86385000, 86385970],
  //   ['Bela Vista Do Paraíso', 86130000, 86135970],
  //   ['Cambará', 86390000, 86390970],
  //   ['Cambé', 86180970, 86199800],
  //   ['Congonhinhas', 86320000, 86325990],
  //   ['Cornélio Procópio', 86300000, 86305990],
  //   ['Florestópolis', 86165000, 86165970],
  //   ['Guapirama', 86465000, 86465970],
  //   ['Guaraci', 86620000, 86625990],
  //   ['Ibiporã', 86200000, 86200991],
  //   ['Itambaracá', 86375000, 86378990],
  //   ['Jacarezinho', 86400000, 86409970],
  //   ['Jaguapitã', 86610000, 86610970],
  //   ['Jataizinho', 86210000, 86215000],
  //   ['Jundiaí Do Sul', 86470000, 86470970],
  //   ['Leópolis', 86330000, 86335990],
  //   ['Londrina', 86001970, 86123970],
  //   ['Miraselva', 86615000, 86615970],
  //   ['Nova América Da Colina', 86230000, 86230970],
  //   ['Nova Fátima', 86310000, 86310970],
  //   ['Nova Santa Bárbara', 86250000, 86250970],
  //   ['Pitangueiras', 86613000, 86613970],
  //   ['Porecatu', 86160000, 86160970],
  //   ['Prado Ferreira', 86618000, 86618970],
  //   ['Primeiro De Maio', 86140000, 86143990],
  //   ['Rancho Alegre', 86290000, 86290970],
  //   ['Ribeirão Claro', 86410000, 86415970],
  //   ['Ribeirão Do Pinhal', 86490000, 86495970],
  //   ['Rolândia', 86600001, 86609991],
  //   ['Santa Amélia', 86370000, 86370970],
  //   ['Santa Cecília Do Pavão', 86225000, 86225970],
  //   ['Santa Mariana', 86350000, 86358970],
  //   ['Santo Antônio Da Platina', 86430000, 86440970],
  //   ['Santo Antônio Do Paraíso', 86315000, 86318970],
  //   ['São Jerônimo Da Serra', 86270000, 86278970],
  //   ['São Sebastião Da Amoreira', 86240000, 86240970],
  //   ['Sapopema', 84290000, 84295970],
  //   ['Sertaneja', 86340000, 86345970],
  //   ['Sertanópolis', 86170000, 86170970],
  //   ['Tamarana', 86125000, 86125970],
  //   ['Uraí', 86280000, 86285970]
  // ]

}
