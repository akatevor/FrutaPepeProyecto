using ClosedXML.Excel;
using APP.Models;
using System.Collections.Generic;
using System.IO;

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

                sheet.Cell(1, 1).Value = "ID";
                sheet.Cell(1, 2).Value = "Nombre";
                sheet.Cell(1, 3).Value = "Tipo";
                sheet.Cell(1, 4).Value = "Color";
                sheet.Cell(1, 5).Value = "Tropical";
                sheet.Cell(1, 6).Value = "Precio";
                sheet.Cell(1, 7).Value = "Proveedor";

                var header = sheet.Range(1, 1, 1, 7);
                header.Style.Font.Bold = true;
                header.Style.Fill.BackgroundColor = XLColor.LightGray;

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
                    row++;
                }

                sheet.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return stream.ToArray();
                }
            }
        }
    }
}
