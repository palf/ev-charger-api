/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: B7uIPnJFSwvx2ZFGSUBYNUPFxXp4VhL8O3o+8kvFFfpXoip4mCwSvf4M7MxuywxBYxmV7cpVNu5WhaShIc19Zg==
 */

/* eslint-disable */
// tslint:disable

interface Locations {
  address: (string) | null
  latitude: number
  /**
   * @default uuid_generate_v4()
   */
  location_id: string & {readonly __brand?: 'locations_location_id'}
  longitude: number
  restaurant_on_site: boolean
}
export default Locations;

interface Locations_InsertParameters {
  address?: (string) | null
  latitude: number
  /**
   * @default uuid_generate_v4()
   */
  location_id?: string & {readonly __brand?: 'locations_location_id'}
  longitude: number
  restaurant_on_site: boolean
}
export type {Locations_InsertParameters}