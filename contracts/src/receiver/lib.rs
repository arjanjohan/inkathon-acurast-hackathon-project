#![cfg_attr(not(feature = "std"), no_std)]

use ink;

#[ink::contract]
mod receiver {

    #[ink(storage)]

    pub struct Receiver {

        price: u128,

    }

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct Receiver {
        random_bytes: Vec<u8>,
    }

    impl Receiver {
        #[ink(constructor)]
        pub fn default() -> Self {
            Self {
                random_bytes: Default::default(),
            }
        }

        #[ink(message)]
        pub fn fulfill(&mut self, bytes: Vec<u8>) {
            self.random_bytes = bytes;
        }

        #[ink(message)]
        pub fn get_bytes(&self) -> Vec<u8> {
            self.random_bytes.clone()
        }
    }

}
