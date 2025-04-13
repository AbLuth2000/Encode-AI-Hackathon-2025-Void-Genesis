use dojo_starter::components::tile::{Tile, TILE_TYPE_NORMAL, TILE_TYPE_VOID};
use dojo_starter::components::player_tile::{PlayerTile, TILE_STATUS_NONE};
use dojo_starter::components::rent::TileRentInfo;
use starknet::{ContractAddress, get_caller_address};
use array::ArrayTrait;

// Public map view struct, merged from multiple components
#[derive(Copy, Drop, Serde)]
pub struct MapTileView {
    pub x: u32,  // Grid coordinate
    pub y: u32,  // Grid coordinate
    pub tile_type: u8,  // 0 = normal, 1 = void
    pub owner: ContractAddress,  // Who owns this tile (can be 0x0)
    pub rent_cost: u128,  // Price to acquire or rent
    pub total_rent_collected: u128,  // Accumulated rent
    pub player_tile_status: u8,  // Additional status (owned, rented, etc.)
    pub player_tile_expiry: u64,  // Optional
    pub is_owned_by_me: bool  // For frontend color logic
}

#[dojo::contract]
mod map_view {
    use super::MapTileView;

    #[external(v0)]
    fn get_world_map(ref self: ContractState) -> Span<MapTileView> {
        let world = self.world(@"dojo_starter");
        let tiles = world.entities::<Tile>();
        let mut map_tiles = ArrayTrait::new();

        let current_player = get_caller_address();

        for tile in tiles.iter() {

            // Get rent info if exists
            let rent_info = match world.try_read::<TileRentInfo>((tile.x, tile.y)) {
                Option::Some(r) => r,
                Option::None => TileRentInfo {
                    x: tile.x,
                    y: tile.y,
                    total_rent_collected: 0,
                    last_rent_timestamp: 0
                }
            };

            // Get player_tile info if available
            let player_tile = match world.try_read::<PlayerTile>((tile.owner, tile.x, tile.y)) {
                Option::Some(p) => p,
                Option::None => PlayerTile {
                    player: tile.owner,
                    x: tile.x,
                    y: tile.y,
                    status: TILE_STATUS_NONE,
                    expiry: 0
                }
            };

            // Detect ownership
            let is_owned_by_me = tile.owner == current_player;

            // Append tile into the result
            map_tiles.append(MapTileView {
                x: tile.x,
                y: tile.y,
                tile_type: tile.tile_type,
                owner: tile.owner,
                rent_cost: tile.rent_cost,
                total_rent_collected: rent_info.total_rent_collected,
                player_tile_status: player_tile.status,
                player_tile_expiry: player_tile.expiry,
                is_owned_by_me
            });
        }

        map_tiles.span()
    }
}