const calculateCommission = (totalAmount) => {
    const commissionRate = 0.10; // 10%
    const adminCommission = totalAmount * commissionRate;
    const vendorAmount = totalAmount - adminCommission;
    return {
        adminCommission,
        vendorAmount
    };
};

module.exports = { calculateCommission };
