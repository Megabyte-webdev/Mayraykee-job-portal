import { Fragment, useState } from 'react';
import { Combobox, Transition, } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
function Selector({ data, selected, setSelected }) {
  const [query, setQuery] = useState('');

  // Filter the data based on the query
  const filteredData =
    query === ''
      ? data
      : data?.filter((current) =>
          current?.name
            ?.toLowerCase()
            ?.replace(/\s+/g, '')
            ?.includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div className="min-w-[300px]">
      <Combobox
        value={selected || { name: 'Select an option' }} // Default to "Select an option"
        onChange={(val) => {
          setSelected(val); // Update the selection
        }}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default border border-gray-400 overflow-hidden bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full outline-none border-none py-[5px] pl-3 pr-10 text-little leading-5 text-black focus:ring-0"
              displayValue={(current) => current?.name || 'Select an option'}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 w-[25px] justify-center flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-full w-full text-gray-400 hover:text-gray-500"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 z-10 max-h-60 w-full border border-gray-400 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {/* Default "Select an option" */}
              <Combobox.Option
                key="default"
                className={({ active }) =>
                  `relative cursor-default select-none flex py-2 pl-10 pr-4 ${
                    active ? 'bg-primaryColor/70 text-white' : 'text-gray-900'
                  }`
                }
                value={{ name: 'Select an option' }} // Placeholder value
              >
                {({ active }) => (
                  <span
                    className={`block truncate ${
                      active ? 'font-medium' : 'font-normal'
                    }`}
                  >
                    Select an option
                  </span>
                )}
              </Combobox.Option>

              {/* Filtered options */}
              {filteredData?.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredData?.map((current) => (
                  <Combobox.Option
                    key={current.id}
                    className={({ active }) =>
                      `relative cursor-default select-none flex py-2 pl-10 pr-4 ${
                        active ? 'bg-primaryColor/70 text-white' : 'text-gray-900'
                      }`
                    }
                    value={current}
                  >
                    {({ selected, active }) => (
                      <>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-[-30px] flex items-center ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {current.name || 'No name attached'}
                        </span>
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}

export default Selector;
