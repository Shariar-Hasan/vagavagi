// PDF export functionality
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Item, Participant, CalculationResult } from '@/types';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: typeof autoTable;
        lastAutoTable?: {
            finalY: number;
        };
    }
}

export const exportToPDF = (
    items: Item[],
    participants: Participant[],
    results: CalculationResult[]
): void => {
    const doc = new jsPDF();

    // Add Bengali font support (using a web-safe approach)
    doc.setFont('helvetica', 'normal');

    // Title
    doc.setFontSize(20);
    doc.text('Vagavagi - Expense Summary', 105, 15, { align: 'center' });

    let yPos = 30;

    // Items Table
    doc.setFontSize(14);
    doc.text('Items', 14, yPos);
    yPos += 5;

    autoTable(doc, {
        startY: yPos,
        head: [['Item Name', 'Unit Price (Tk)', 'Quantity', 'Total (Tk)']],
        body: items.map((item) => [
            item.name,
            item.unitPrice.toFixed(2),
            item.quantity.toFixed(2),
            (item.unitPrice * item.quantity).toFixed(2),
        ]),
        theme: 'striped',
        headStyles: {
            fillColor: [99, 102, 241],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: {
            0: { cellWidth: 70, halign: 'left' },
            1: { cellWidth: 40, halign: 'right' },
            2: { cellWidth: 30, halign: 'right' },
            3: { cellWidth: 40, halign: 'right' }
        },
    });

    yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : yPos + 50;

    // Participants and Usage Table
    doc.setFontSize(14);
    doc.text('Participant Usage', 14, yPos);
    yPos += 5;

    const participantRows: string[][] = [];
    participants.forEach((participant) => {
        participantRows.push([participant.name, '', '', '']);
        participant.usage.forEach((usage) => {
            const item = items.find((i) => i.id === usage.itemId);
            if (item) {
                participantRows.push([
                    `  - ${item.name}`,
                    usage.unitsUsed.toFixed(2),
                    item.unitPrice.toFixed(2),
                    (usage.unitsUsed * item.unitPrice).toFixed(2),
                ]);
            }
        });
    });

    autoTable(doc, {
        startY: yPos,
        head: [['Participant / Item', 'Units', 'Unit Price (Tk)', 'Subtotal (Tk)']],
        body: participantRows,
        theme: 'striped',
        headStyles: {
            fillColor: [59, 130, 246],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: {
            0: { cellWidth: 70, halign: 'left' },
            1: { cellWidth: 30, halign: 'right' },
            2: { cellWidth: 40, halign: 'right' },
            3: { cellWidth: 40, halign: 'right' }
        },
    });

    yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : yPos + 50;

    // Summary Table
    doc.setFontSize(14);
    doc.text('Settlement Summary', 14, yPos);
    yPos += 5;

    autoTable(doc, {
        startY: yPos,
        head: [['Name', 'Total Owed (Tk)', 'Paid (Tk)', 'Balance (Tk)', 'Status']],
        body: results.map((result) => [
            result.participantName,
            result.totalOwed.toFixed(2),
            result.amountPaid.toFixed(2),
            Math.abs(result.balance).toFixed(2),
            result.balance >= 0 ? 'Receive' : 'Pay',
        ]),
        theme: 'striped',
        headStyles: {
            fillColor: [34, 197, 94],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: {
            0: { cellWidth: 50, halign: 'left' },
            1: { cellWidth: 35, halign: 'right' },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 35, halign: 'right' },
            4: { cellWidth: 25, halign: 'center' }
        },
        didParseCell: function (data) {
            // Color the Balance column (index 3) and Status column (index 4)
            if (data.section === 'body' && (data.column.index === 3 || data.column.index === 4)) {
                const rowIndex = data.row.index;
                const result = results[rowIndex];
                if (result) {
                    // Green for receive (positive balance), Red for pay (negative balance)
                    if (result.balance >= 0) {
                        data.cell.styles.textColor = [22, 163, 74]; // Green-600
                        data.cell.styles.fontStyle = 'bold';
                    } else {
                        data.cell.styles.textColor = [220, 38, 38]; // Red-600
                        data.cell.styles.fontStyle = 'bold';
                    }
                }
            }
        }
    });

    // Save the PDF
    doc.save('vagavagi-summary.pdf');
};
