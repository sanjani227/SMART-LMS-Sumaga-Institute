export default function StudentPayments() {
    const invoices = [
        { label: "Tuition - March", amount: "Rs1450", status: "Paid" },
        { label: "Lab Fee", amount: "Rs600", status: "Pending" },
        { label: "Library", amount: "Rs200", status: "Paid" },
    ];

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Payments</h2>
                <p className="text-sm text-gray-500">Invoice status and amounts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Total due</p>
                    <p className="text-2xl font-bold">$60</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Paid this month</p>
                    <p className="text-2xl font-bold">$470</p>
                </div>
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-gray-500">Pending invoices</p>
                    <p className="text-2xl font-bold">1</p>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm divide-y">
                {invoices.map((inv) => (
                    <div key={inv.label} className="p-4 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-800">{inv.label}</p>
                            <p className="text-xs text-gray-500">Amount: {inv.amount}</p>
                        </div>
                        <span className={`text-sm font-medium ${inv.status === "Paid" ? "text-green-600" : "text-orange-600"}`}>
                            {inv.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
