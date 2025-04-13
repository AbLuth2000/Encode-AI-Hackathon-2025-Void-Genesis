use starknet::ContractAddress;

// Status constants
pub const TILE_STATUS_OWNER: u8 = 0;
pub const TILE_STATUS_RENTER: u8 = 1;
pub const TILE_STATUS_CAPTURED: u8 = 2;
pub const TILE_STATUS_NONE: u8 = 3;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct PlayerTile {
    #[key]
    pub player: ContractAddress,
    #[key]
    pub x: u32,
    #[key]
    pub y: u32,
    pub status: u8,
    pub expiry: u64
}