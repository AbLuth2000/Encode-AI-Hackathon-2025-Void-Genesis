use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Player {
    #[key]
    pub player_id: ContractAddress,
    pub tokens_balance: u128,
    pub total_rent_earned: u128,
    pub position_x: u32,
    pub position_y: u32,
    pub tiles_owned: u32,
}