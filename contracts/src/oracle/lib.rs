#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod oracle {
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        CallerNotInAllowList,
        NotAdmin,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    #[ink(storage)]
    pub struct SimpleOracle {
        prices: Mapping<Vec<u8>, u128>,
        allow_list: Mapping<AccountId, ()>,
        admin: Option<AccountId>,
    }

    impl SimpleOracle {
        #[ink(constructor)]
        pub fn new(admin: Option<AccountId>) -> Self {
            Self {
                prices: Mapping::new(),
                allow_list: Mapping::new(),
                admin,
            }
        }

        #[ink(constructor)]
        pub fn default() -> Self {
            Self::new(None)
        }

        #[ink(message)]
        pub fn fulfill(&mut self, values: Vec<(Vec<u8>, u128)>) -> Result<()> {
            if !self.allow_list.contains(self.env().caller()) {
                return Err(Error::CallerNotInAllowList);
            }

            for (key, value) in values {
                self.prices.insert(key, &value);
            }

            Ok(())
        }

        #[ink(message)]
        pub fn allow(&mut self, account: AccountId) -> Result<()> {
            if let Some(admin) = self.admin {
                if self.env().caller() != admin {
                    return Err(Error::NotAdmin);
                }
            }
            self.allow_list.insert(account, &());
            Ok(())
        }

        #[ink(message)]
        pub fn disallow(&mut self, account: AccountId) -> Result<()> {
            if let Some(admin) = self.admin {
                if self.env().caller() != admin {
                    return Err(Error::NotAdmin);
                }
            }
            self.allow_list.remove(account);
            Ok(())
        }

        /// Returns the current value for given key.
        #[ink(message)]
        pub fn get(&self, key: Vec<u8>) -> Option<u128> {
            self.prices.get(key)
        }
    }

    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        /// We test if the default constructor does its job.
        #[ink::test]
        fn default_works() {
            let simple_oracle = SimpleOracle::default();
            assert_eq!(simple_oracle.get(Default::default()), None);
        }

        /// We test a simple use case of our contract.
        #[ink::test]
        fn it_works() {
            let mut simple_oracle = SimpleOracle::new(None);
            assert_eq!(simple_oracle.get(Default::default()), None);
            simple_oracle
                .allow(AccountId::from([1; 32]))
                .expect("can allow account");
            simple_oracle
                .fulfill(vec![(vec![0], 10)])
                .expect("fulfill works");
            assert_eq!(simple_oracle.get(vec![0]), Some(10));
        }
    }
}
