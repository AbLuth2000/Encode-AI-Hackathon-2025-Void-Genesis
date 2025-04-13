use starknet::ContractAddress;
//

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct InventoryItem {
    #[key]
    pub player: ContractAddress,
    #[key]
    pub item_id: u64,
    pub description: felt252,
    pub asset_url: felt252,
    pub crafting_timestamp: u64
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct InventoryCounter {
    #[key]
    pub player: ContractAddress,
    pub count: u64
}