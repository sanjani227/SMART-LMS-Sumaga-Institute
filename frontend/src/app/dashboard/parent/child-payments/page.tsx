export default function ChildPayments() {
    const invoices = [
        { label: "Tuition - March", amount: "$450", status: "Paid" },
        { label: "Activity Fee", amount: "$40", status: "Pending" },
    ];

    return (
        <div className="p-6 space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Payments</h2>
                <p className="text-sm text-gray-500">Your child's school invoices.</p>
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