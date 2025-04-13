use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct TileRentInfo {
    #[key]
    pub x: u32,
    #[key]
    pub y: u32,
    pub total_rent_collected: u128,
    pub last_rent_timestamp: u64
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct RentPaid {
    #[key]
    pub payer: ContractAddress,
    pub owner: ContractAddress,
    pub x: u32,
    pub y: u32,
    pub amount: u128,
    pub timestamp: u64
}