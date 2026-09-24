const API_URL = window.CONFIG && window.CONFIG.API_URL ? window.CONFIG.API_URL : 'https://safira-admin-frontend-production.up.railway.app';

document.addEventListener('DOMContentLoaded', () => {
    loadMerchantShipments();
});

// دالة إضافة شحنة جديدة بواسطة التاجر
async function createMerchantShipment(event) {
    event.preventDefault();
    
    const shipmentData = {
        recipientName: document.getElementById('recName').value,
        recipientPhone: document.getElementById('recPhone').value,
        governorate: document.getElementById('recGov').value,
        address: document.getElementById('recAddress').value,
        price: document.getElementById('shipPrice').value,
        notes: document.getElementById('shipNotes').value
    };

    try {
        const response = `${API_URL}/api/shipments`;
        const res = await fetch(response, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shipmentData)
        });

        if (res.ok) {
            alert('تم إضافة الشحنة بنجاح وإرسالها للنظام');
            document.getElementById('addShipmentForm').reset();
            loadMerchantShipments();
        } else {
            alert('فشل في حفظ الشحنة، تأكد من البيانات');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ في الاتصال بالخادم');
    }
}

// دالة جلب وعرض شحنات التاجر فقط
async function loadMerchantShipments() {
    const tableBody = document.getElementById('merchantShipmentsTable');
    if (!tableBody) return;

    try {
        const res = await fetch(`${API_URL}/api/shipments/merchant`);
        if (res.ok) {
            const shipments = await res.json();
            tableBody.innerHTML = shipments.map(s => `
                <tr class="border-b hover:bg-slate-50">
                    <td class="py-3 px-4">${s.id || '---'}</td>
                    <td class="py-3 px-4">${s.recipientName}</td>
                    <td class="py-3 px-4">${s.governorate}</td>
                    <td class="py-3 px-4 font-bold">${s.price} ج.م</td>
                    <td class="py-3 px-4"><span class="px-2 py-1 rounded text-xs bg-amber-100 text-amber-800">${s.status || 'قيد الانتظار'}</span></td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading shipments:', error);
    }
}
