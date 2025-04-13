use dojo_starter::models::{Direction, Position};
use dojo_starter::components::player::Player;
use dojo_starter::components::tile::{Tile, TILE_TYPE_NORMAL, TILE_TYPE_VOID};
use dojo_starter::components::rent::{TileRentInfo, RentPaid};
use starknet::{ContractAddress, get_block_timestamp};
use dojo::event::EventStorage;


// Define the interface
#[starknet::interface]
pub trait IActions<T> {
    // Player management
    fn spawn_player(ref self: T);
    fn move_player(ref self: T, x: u32, y: u32);
    fn create_void_tile(ref self: T, x: u32, y: u32, acquisition_cost: u128);
    fn acquire_void_tile(ref self: T, x: u32, y: u32) -> bool;
    fn craft_void_to_normal(ref self: T, x: u32, y: u32, description: felt252, asset_url: felt252, is_captured: bool);

    // Tile management
    fn create_normal_tile(ref self: T, x: u32, y: u32, rent_cost: u128);
    fn collect_rent(ref self: T, x: u32, y: u32);

    // Area management
    fn check_captured_area(ref self: T, center_x: u32, center_y: u32) -> bool;
    fn capture_tile_if_surrounded(ref self: T, center_x: u32, center_y: u32);
}

// Dojo contract implementation
#[dojo::contract]
pub mod actions {
    use super::IActions;
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use dojo_starter::models::{Direction, Position, Vec2, Moves};
    use dojo_starter::components::player::Player;
    use dojo_starter::components::tile::{Tile, TILE_TYPE_NORMAL, TILE_TYPE_VOID};
    use dojo_starter::components::rent::{TileRentInfo, RentPaid};

    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;
    const DEFAULT_RENT_COST: u128 = 50;
    const CRAFT_BUY_COST: u128 = 100;

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct VoidTileCreated {
        #[key]
        pub creator: ContractAddress,
        pub x: u32,
        pub y: u32,
        pub acquisition_cost: u128,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct VoidTileAcquired {
        #[key]
        pub player: ContractAddress,
        pub x: u32,
        pub y: u32,
        pub cost: u128,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct TileCrafted {
        #[key]
        pub player: ContractAddress,
        pub x: u32,
        pub y: u32,
        pub asset_id: felt252,
        pub description: felt252,
        pub timestamp: u64,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct TileCaptured {
        #[key]
        pub capturer: ContractAddress,
        pub original_owner: ContractAddress,
        pub x: u32,
        pub y: u32,
        pub loot_amount: u128,
        pub timestamp: u64,
    }

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn spawn_player(ref self: ContractState) {
            let mut world = self.world_default();
            let player = get_caller_address();

            let new_player = Player {
                player_id: player,
                tokens_balance: 1000,
                total_rent_earned: 0,
                position_x: 0,
                position_y: 0, 
                tiles_owned: 0,
            };

            world.write_model(@new_player);

            let position = Position {
                player, vec: Vec2 { x: 0, y: 0 },
            };

            let moves = Moves {
                player, remaining: 100, last_direction: Option::None, can_move: true,
            };

            world.write_model(@position);
            world.write_model(@moves);
        }

        fn move_player(ref self: ContractState, x: u32, y: u32) {
            let mut world = self.world_default();
            let player = get_caller_address();

            let mut player_data: Player = world.read_model(player);
            player_data.position_x = x;
            player_data.position_y = y;
            world.write_model(@player_data);

            let position = Position {
                player, vec: Vec2 { x, y },
            };
            world.write_model(@position);

            self.capture_tile_if_surrounded(x, y);
        }

        fn create_normal_tile(ref self: ContractState, x: u32, y: u32, rent_cost: u128) {
            let mut world = self.world_default();
            let player = get_caller_address();

            let mut player_data: Player = world.read_model(player);
            if player_data.tokens_balance < CRAFT_BUY_COST {
                return;
            }
            player_data.tokens_balance -= CRAFT_BUY_COST;

            let new_tile = Tile {
                x,
                y,
                owner: player,
                tile_type: TILE_TYPE_NORMAL,
                rent_cost: DEFAULT_RENT_COST,
                description: 'Default description',
                asset_url: 'ipfs://default',
                is_captured: false,
            };

            let rent_info = TileRentInfo {
                x,
                y,
                total_rent_collected: 0,
                last_rent_timestamp: 0
            };

            world.write_model(@new_tile);
            world.write_model(@rent_info);
            world.write_model(@player_data);
        }

        fn create_void_tile(ref self: ContractState, x: u32, y: u32, acquisition_cost: u128) {
            let mut world = self.world_default();
            let player = get_caller_address();

            let void_tile = Tile {
                x,
                y,
                owner: starknet::contract_address_const::<0>(),
                tile_type: TILE_TYPE_VOID,
                rent_cost: acquisition_cost,
                description: 'Void tile'.into(), 
                asset_url: 'ipfs://placeholder'.into(),
                is_captured: false,
            };

            world.write_model(@void_tile);
            world.emit_event(
                @VoidTileCreated {
                    creator: player,
                    x,
                    y,
                    acquisition_cost,
                    timestamp: get_block_timestamp()
                }
            );
        }

        fn acquire_void_tile(ref self: ContractState, x: u32, y: u32) -> bool {
            let mut world = self.world_default();
            let player = get_caller_address();

            let mut tile: Tile = world.read_model((x, y));

            if tile.tile_type != TILE_TYPE_VOID || tile.owner != starknet::contract_address_const::<0>() {
                return false;
            }

            let mut player_data: Player = world.read_model(player);

            if player_data.tokens_balance < tile.rent_cost {
                return false;
            }

            player_data.tokens_balance -= tile.rent_cost;
            tile.owner = player;

            world.write_model(@player_data);
            world.write_model(@tile);
            world.emit_event(
                @VoidTileAcquired {
                    player,
                    x,
                    y,
                    cost: tile.rent_cost,
                    timestamp: get_block_timestamp()
                }
            );

            true
        }

        fn craft_void_to_normal(ref self: ContractState, x: u32, y: u32, description: felt252, asset_url: felt252, is_captured: bool) {
            let mut world = self.world_default();
            let player = get_caller_address();

            let tile: Tile = world.read_model((x, y));
            assert(tile.tile_type == TILE_TYPE_VOID, 'Must be a void tile');
            assert(tile.owner == player, 'Must own the void tile');

            let mut player_data: Player = world.read_model(player);
            let crafting_cost: u128 = 100;
            assert(player_data.tokens_balance >= crafting_cost, 'Insufficient tokens');
            player_data.tokens_balance -= crafting_cost;

            let new_tile = Tile {
                x,
                y,
                owner: player,
                tile_type: TILE_TYPE_NORMAL,
                rent_cost: 5,
                description,
                asset_url,
                is_captured,
            };

            let rent_info = TileRentInfo {
                x,
                y,
                total_rent_collected: 0,
                last_rent_timestamp: 0
            };

            world.write_model(@player_data);
            world.write_model(@new_tile);
            world.write_model(@rent_info);
            world.emit_event(
                @TileCrafted {
                    player,
                    x,
                    y,
                    asset_id: asset_url,
                    description,
                    timestamp: get_block_timestamp()
                }
            );
        }

        fn collect_rent(ref self: ContractState, x: u32, y: u32) {
            let mut world = self.world_default();
            let player = get_caller_address();

            let tile: Tile = world.read_model((x, y));
            if tile.owner != player {
                return;
            }

            let mut rent_info: TileRentInfo = world.read_model((x, y));
            if rent_info.total_rent_collected == 0 {
                return;
            }

            let mut player_data: Player = world.read_model(player);
            player_data.tokens_balance += rent_info.total_rent_collected;
            player_data.total_rent_earned += rent_info.total_rent_collected;

            rent_info.total_rent_collected = 0;

            world.write_model(@player_data);
            world.write_model(@rent_info);
        }

        fn check_captured_area(ref self: ContractState, center_x: u32, center_y: u32) -> bool {
            let mut world = self.world_default();
            let player = get_caller_address();

            let mut i = 0;
            let mut captured_possible = true;

            while i < 3 {
                let mut j = 0;
                while j < 3 {
                    let x = center_x + i - 1;
                    let y = center_y + j - 1;

                    let tile: Tile = world.read_model((x, y));

                    if i == 1 && j == 1 {
                        if tile.tile_type == TILE_TYPE_VOID {
                            captured_possible = false;
                        }
                    } else {
                        if tile.owner != player {
                            captured_possible = false;
                        }
                    }

                    j += 1;
                };
                i += 1;
            };

            captured_possible
        }

        fn capture_tile_if_surrounded(ref self: ContractState, center_x: u32, center_y: u32) {
            if self.check_captured_area(center_x, center_y) {
                let mut world = self.world_default();
                let player = get_caller_address();

                let mut tile: Tile = world.read_model((center_x, center_y));
                tile.owner = player;

                world.write_model(@tile);
            }
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"dojo_starter")
        }
    }
}

fn next_position(mut position: Position, direction: Option<Direction>) -> Position {
    match direction {
        Option::None => position,
        Option::Some(d) => {
            match d {
                Direction::Left => position.vec.x -= 1,
                Direction::Right => position.vec.x += 1,
                Direction::Up => position.vec.y -= 1,
                Direction::Down => position.vec.y += 1,
            };
            position
        },
    }
}
