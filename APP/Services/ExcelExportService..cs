using ClosedXML.Excel;
using APP.Models;
using System.Collections.Generic;
using System.IO;
using System;

namespace APP.Services
{
    public interface IExcelExportService
    {
        byte[] ExportFrutasToExcel(List<Fruta> frutas);
    }

    public class ExcelExportService : IExcelExportService
    {
        public byte[] ExportFrutasToExcel(List<Fruta> frutas)
        {
            using (var workbook = new XLWorkbook())
            {
                var sheet = workbook.Worksheets.Add("Listado de Frutas");

                // Encabezados
                sheet.Cell(1, 1).Value = "ID";
                sheet.Cell(1, 2).Value = "Nombre";
                sheet.Cell(1, 3).Value = "Tipo";
                sheet.Cell(1, 4).Value = "Color";
                sheet.Cell(1, 5).Value = "Es Tropical";
                sheet.Cell(1, 6).Value = "Precio";
                sheet.Cell(1, 7).Value = "Proveedor";
                sheet.Cell(1, 8).Value = "Teléfono";
                sheet.Cell(1, 9).Value = "Email";

                var header = sheet.Range(1, 1, 1, 9);
                header.Style.Font.Bold = true;
                header.Style.Fill.BackgroundColor = XLColor.LightGray;

                // Llenado de datos
                int row = 2;
                foreach (var fruta in frutas)
                {
                    sheet.Cell(row, 1).Value = fruta.IdFruta;
                    sheet.Cell(row, 2).Value = fruta.Nombre;
                    sheet.Cell(row, 3).Value = fruta.Tipo;
                    sheet.Cell(row, 4).Value = fruta.Color;
                    sheet.Cell(row, 5).Value = fruta.EsTropical ? "Sí" : "No";
                    sheet.Cell(row, 6).Value = fruta.Precio;
                    sheet.Cell(row, 7).Value = fruta.Proveedor?.Nombre ?? "Sin proveedor";
                    sheet.Cell(row, 8).Value = fruta.Proveedor?.Telefono ?? "";
                    sheet.Cell(row, 9).Value = fruta.Proveedor?.Email ?? "";
                    row++;
                }

                // Ajuste automático de columnas
                sheet.Columns().AdjustToContents();

                // Exportar a bytes
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return stream.ToArray();
                }
            }
        }
    }
}
