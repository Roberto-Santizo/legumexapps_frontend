import { BoletaRmpAllInfo } from 'types/rmpDocTypes';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import React from 'react';
import Signature from '../utilities-components/Signature';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  page: {
    backgroundColor: '#FFFDE7',
    padding: 20,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logo: {
    width: 60,
    height: 40,
    marginRight: 10,
  },
  companyInfo: {
    fontSize: 8,
  },
  centerTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  receiptNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 5,
  },
  headerRight: {
    fontSize: 8,
    textAlign: 'right',
  },
  headerField: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 3,
  },
  headerLabel: {
    marginRight: 5,
  },
  headerValue: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    minWidth: 80,
    textAlign: 'right',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    width: '50%',
    marginBottom: 5,
    paddingRight: 10,
  },
  infoFullRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 8,
    marginRight: 5,
  },
  infoValue: {
    fontSize: 8,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  dataSection: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  fieldData: {
    flex: 6,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#FFFDE7',
    borderWidth: 1,
    borderColor: '#000000',
  },
  plantData: {
    flex: 4,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#FFFDE7',
    borderWidth: 1,
    borderColor: '#000000',
  },
  differenceData: {
    flex: 2,
    padding: 5,
    backgroundColor: '#FFFDE7',
    borderWidth: 1,
    borderColor: '#000000',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelWithPrefix: {
    fontSize: 7,
    fontWeight: 'bold',
    width: '30%',
  },
  dataLabel: {
    fontSize: 7,
    width: '30%',
  },
  dataValue: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dataBox: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 2,
    fontSize: 7,
    textAlign: 'right',
    width: 70,
    height: 16,
  },
  smallDataBox: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 2,
    fontSize: 7,
    textAlign: 'center',
    width: 40,
    height: 16,
  },
  boxLabel: {
    fontSize: 6,
    textAlign: 'center',
    marginTop: 1,
    color: '#000000',
  },
  equals: {
    paddingHorizontal: 2,
    fontSize: 7,
  },
  diffColumn: {
    alignItems: 'center',
  },
  diffTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    paddingTop: 5,
  },
  diffBox: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 2,
    fontSize: 7,
    textAlign: 'center',
    width: 50,
    height: 16,
    marginBottom: 25,
  },
  statusBox: {
    width: 30,
    height: 30,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#22C55E',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 10,
    fontSize: 6,
    textAlign: 'center',
    color: '#4B5563',
  },
  signatureSection: {
    width: '33%',
    marginTop: 20,
  },

  signatureBox: {
    padding: 10,
    marginBottom: 5,
    alignItems: 'center',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  formulaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  formulaPrefix: {
    fontSize: 7,
    fontWeight: 'bold',
    width: '25%',
    paddingRight: 2,
  },
  formulaExpression: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  formula: {
    fontSize: 7,
    paddingLeft: 2,
  },
  mediumDataBox: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 2,
    minWidth: 55,
    textAlign: 'center',
    fontSize: 7,
    width: 40,
    height: 16,
  },
});

const PdfBoletaCampoRMP: React.FC<{ boleta: BoletaRmpAllInfo }> = ({ boleta }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            src={`/public/logo.png`}
            style={styles.logo}
          />
          <View style={styles.companyInfo}>
            <Text>Agroindustria Legumex,</Text>
            <Text>Chimaltenango Guatemala</Text>
            <Text>PBX: 7963-0888 FAX: 7937-5005</Text>
          </View>
        </View>

        <View style={styles.centerTitle}>
          <Text style={styles.title}>RECIBO DE MATERIA PRIMA</Text>
          <Text style={styles.receiptNumber}>No. LX2-{boleta.field_data.id}</Text>
        </View>

        <View style={styles.headerRight}>
          <Text>R-PRO-MP-02</Text>
          <View style={styles.headerField}>
            <Text style={styles.headerLabel}>GRN No.</Text>
            <Text style={styles.headerValue}>{boleta.grn}</Text>
          </View>
          <View style={styles.headerField}>
            <Text style={styles.headerLabel}>FECHA</Text>
            <Text style={styles.headerValue}>{boleta.field_data.doc_date}</Text>
          </View>
          <View style={styles.headerField}>
            <Text style={styles.headerLabel}>C.D.P.</Text>
            <Text style={styles.headerValue}>{boleta.field_data.cdp}</Text>
          </View>
        </View>
      </View>

      {/* Información General */}
      <View style={styles.infoGrid}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>TRANSP:</Text>
          <Text style={styles.infoValue}>{boleta.field_data.transport}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>PILOTO:</Text>
          <Text style={styles.infoValue}>{boleta.field_data.pilot_name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>FINCA:</Text>
          <Text style={styles.infoValue}>{boleta.finca}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>PRODUCTOR:</Text>
          <Text style={styles.infoValue}>{boleta.field_data.coordinator}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>PLACA:</Text>
          <Text style={styles.infoValue}>{boleta.field_data.plate}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>PRODUCTO:</Text>
          <Text style={styles.infoValue}>{boleta.field_data.product}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>INSPECT:</Text>
          <Text style={styles.infoValue}>{boleta.field_data.inspector}</Text>
        </View>
        <View style={styles.infoFullRow}>
          <Text style={styles.infoLabel}>VARIEDAD PRODUCTO:</Text>
          <Text style={styles.infoValue}>{boleta.field_data.variety}</Text>
        </View>
      </View>

      <View style={styles.dataSection}>
        <View style={styles.fieldData}>
          <Text style={styles.sectionTitle}>Datos Campo</Text>

          <View style={styles.dataRow}>
            <Text style={styles.labelWithPrefix}>A. PESO BRUTO</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={styles.dataBox}>{boleta.field_data.gross_weight}</Text>
              <Text style={[styles.boxLabel, { marginTop: 3 }]}>PESO BRUTO</Text>
            </View>
          </View>

          <View style={styles.dataRow}>
            <Text style={[styles.boxLabel, { paddingRight: 5 }]}>B. TARA</Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
              <View style={{ alignItems: 'center', marginRight: 6 }}>
                <Text style={[styles.smallDataBox, { minWidth: 70 }]}>{boleta.field_data.total_baskets}</Text>
                <Text style={[styles.boxLabel, { marginTop: 3 }]}>CANTIDAD DE</Text>
                <Text style={styles.boxLabel}>CANASTAS</Text>
              </View>

              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 8, marginHorizontal: 6 }}>
                <Text style={styles.equals}>X</Text>
              </View>

              <View style={{ alignItems: 'center', marginRight: 6 }}>
                <Text style={[styles.smallDataBox, { minWidth: 70 }]}>{boleta.field_data.weight_baskets}</Text>
                <Text style={[styles.boxLabel, { marginTop: 3 }]}>PESO POR</Text>
                <Text style={styles.boxLabel}>CANASTAS</Text>
              </View>

              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 8, marginHorizontal: 6 }}>
                <Text style={styles.equals}>=</Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.smallDataBox, { minWidth: 70 }]}>{boleta.field_data.weight_baskets}</Text>
                <Text style={[styles.boxLabel, { marginTop: 3 }]}>TARA</Text>
              </View>
            </View>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.labelWithPrefix}>C. PESO MATERIA PRIMA (A) - (B)</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={styles.dataBox}>{boleta.field_data.net_weight}</Text>
              <Text style={[styles.boxLabel, { marginTop: 3 }]}>PESO NETO</Text>
            </View>
          </View>

          <View style={styles.dataRow}>
            <Text style={[styles.labelWithPrefix, { fontSize: 8, width: 'auto' }]}>D. PESO A PAGAR = % DE CALIDAD</Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
              <View style={{ alignItems: 'center', marginRight: 4 }}>
                <Text style={[styles.smallDataBox, { width: 70, minWidth: 70 }]}>{boleta.field_data.percentage_field}</Text>
                <Text style={[styles.boxLabel, { marginTop: 3 }]}>%CC A PAGAR</Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 8, marginHorizontal: 4 }}>
                <Text style={styles.equals}>=</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.dataBox}>{boleta.field_data.valid_pounds}</Text>
                <Text style={[styles.boxLabel, { marginTop: 3 }]}>LIBRAS A PAGAR</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.plantData}>
          <Text style={styles.sectionTitle}>Datos de Planta</Text>

          <View style={styles.dataRow}>
            <View style={styles.dataValue}>
              <Text style={styles.dataBox}>{boleta.prod_data?.gross_weight}</Text>
            </View>
          </View>

          <View style={[styles.dataRow, { justifyContent: 'flex-end', marginTop: -4 }]}>
            <Text style={[styles.boxLabel, { paddingRight: 15 }]}>PESO BRUTO</Text>
          </View>

          <View style={styles.dataRow}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.smallDataBox, { minWidth: 70 }]}>{boleta.prod_data?.total_baskets}</Text>
                <Text style={[styles.boxLabel, { marginTop: 4 }]}>CANTIDAD DE</Text>
                <Text style={styles.boxLabel}>CANASTAS</Text>
              </View>

              <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 16 }}>
                <Text style={styles.equals}>X</Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.smallDataBox, { minWidth: 70 }]}>{boleta.prod_data?.weight_baskets}</Text>
                <Text style={[styles.boxLabel, { marginTop: 4 }]}>PESO POR</Text>
                <Text style={styles.boxLabel}>CANASTAS</Text>
              </View>

              <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 16 }}>
                <Text style={styles.equals}>=</Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.smallDataBox, { minWidth: 70 }]}>{boleta.prod_data?.tara}</Text>
                <Text style={[styles.boxLabel, { marginTop: 4 }]}>TARA</Text>
              </View>
            </View>
          </View>

          <View style={styles.dataRow}>
            <View style={styles.dataValue}>
              <Text style={styles.dataBox}>{boleta.prod_data?.net_weight}</Text>
            </View>
          </View>

          <View style={[styles.dataRow, { justifyContent: 'flex-end', marginTop: -4 }]}>
            <Text style={[styles.boxLabel, { paddingRight: 15 }]}>PESO NETO</Text>
          </View>

          <View style={styles.dataRow}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Text style={[styles.smallDataBox, { width: 70, minWidth: 70 }]}>{boleta.quality_doc_data?.percentage}</Text>
              <View style={{ width: 28, height: 20, justifyContent: 'center', alignItems: 'center', marginHorizontal: 4 }}>
                <Text style={styles.equals}>=</Text>
              </View>
              <Text style={styles.dataBox}>{(boleta.quality_doc_data?.valid_pounds)?.toFixed(2)}</Text>
            </View>
          </View>

          <View style={[styles.dataRow, { marginTop: -4 }]}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
              <View style={{ alignItems: 'center', width: 70, marginRight: 33 }}>
                <Text style={styles.boxLabel}>%CC A PAGAR</Text>
              </View>

              <View style={[styles.dataRow, { justifyContent: 'flex-end', marginTop: -4 }]}>
                <Text style={[styles.boxLabel, { paddingRight: 10 }]}>LIBRAS VALIDADAS</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.differenceData}>
          <View style={styles.diffColumn}>
            <Text style={styles.diffTitle}>DIFERENCIA</Text>

            <Text style={styles.diffBox}>
              {(boleta.field_data.gross_weight - (boleta.prod_data?.gross_weight ?? 0)).toFixed(2)}
            </Text>

            <Text style={styles.diffBox}>
              {(boleta.field_data.weight_baskets - (boleta.prod_data?.tara ?? 0)).toFixed(2)}
            </Text>

            <Text style={styles.diffBox}>
              {(boleta.field_data.net_weight - (boleta.prod_data?.net_weight ?? 0)).toFixed(2)}
            </Text>

            <Text style={styles.diffBox}>
              {(boleta.field_data.valid_pounds - (boleta.quality_doc_data?.valid_pounds ?? 0)).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}>
              <Signature firma={boleta.field_data.driver_pdf_signature} />
            </View>
            <Text style={styles.signatureLabel}>Firma Piloto</Text>
          </View>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}>
              <Signature firma={boleta.field_data.inspector_pdf_signature} />
            </View>
            <Text style={styles.signatureLabel}>Firma Inspector</Text>
          </View>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine}>
              <Signature firma={boleta.field_data.producer_pdf_signature} />
            </View>
            <Text style={styles.signatureLabel}>Firma Productor</Text>
          </View>
        </View>

        {boleta.prod_data && (
          <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine}>
                <Signature firma={boleta.prod_data?.receptor_pdf_signature} />
              </View>
              <Text style={styles.signatureLabel}>Firma Receptor</Text>
            </View>
          </View>
        )}

        {boleta.quality_doc_data && (
          <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine}>
                <Signature firma={boleta.quality_doc_data?.inspector_pdf_planta_signature} />
              </View>
              <Text style={styles.signatureLabel}>Firma Inspector de Calidad</Text>
            </View>
          </View>
        )}
      </View>

    </Page>
  </Document>
);

export default PdfBoletaCampoRMP;


