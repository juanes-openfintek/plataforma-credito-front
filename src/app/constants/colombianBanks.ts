/**
 * Lista de bancos en Colombia
 * Este es un mock temporal hasta que el endpoint /mono/banks esté disponible
 */

export interface Bank {
  code: string;
  name: string;
  supported_account_types: string[];
}

export const colombianBanks: Bank[] = [
  { code: '001', name: 'Banco de Bogotá', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '002', name: 'Banco Popular', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '006', name: 'Itaú', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '007', name: 'Bancolombia', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '009', name: 'Citibank', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '012', name: 'Banco GNB Sudameris', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '013', name: 'BBVA Colombia', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '014', name: 'Itaú CorpBanca Colombia', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '019', name: 'Scotiabank Colpatria', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '023', name: 'Banco de Occidente', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '031', name: 'Bancoldex', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '032', name: 'Banco Caja Social', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '040', name: 'Banco Agrario', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '051', name: 'Davivienda', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '052', name: 'Banco AV Villas', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '053', name: 'Banco WWB', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '058', name: 'Banco Procredit Colombia', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '059', name: 'Bancamía', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '060', name: 'Banco Pichincha', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '061', name: 'Bancoomeva', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '062', name: 'Banco Falabella', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '063', name: 'Banco Finandina', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '064', name: 'Banco Multibank', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '065', name: 'Banco Santander', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '066', name: 'Banco Cooperativo Coopcentral', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '067', name: 'Banco Serfinanza', supported_account_types: ['savings_account', 'checking_account'] },
  { code: '121', name: 'Juriscoop', supported_account_types: ['savings_account'] },
  { code: '283', name: 'Cooperativa Financiera de Antioquia', supported_account_types: ['savings_account'] },
  { code: '289', name: 'Cotrafa Cooperativa Financiera', supported_account_types: ['savings_account'] },
  { code: '292', name: 'Confiar Cooperativa Financiera', supported_account_types: ['savings_account'] },
  { code: '370', name: 'Coltefinanciera', supported_account_types: ['savings_account'] },
  { code: '507', name: 'Nequi', supported_account_types: ['savings_account'] },
  { code: '551', name: 'Daviplata', supported_account_types: ['savings_account'] },
  { code: '558', name: 'Powwi', supported_account_types: ['savings_account'] },
  { code: '801', name: 'Movii', supported_account_types: ['savings_account'] },
  { code: '803', name: 'Rappipay', supported_account_types: ['savings_account'] },
  { code: '804', name: 'Lulo Bank', supported_account_types: ['savings_account'] },
];

export default colombianBanks;
