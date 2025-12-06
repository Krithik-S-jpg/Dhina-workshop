import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mock implementation for when Supabase is not configured
const createMockClient = () => {
  console.log('Using Mock Supabase Client with LocalStorage');

  const getTable = (table: string) => JSON.parse(localStorage.getItem(table) || '[]');
  const setTable = (table: string, data: any[]) => localStorage.setItem(table, JSON.stringify(data));

  // Seed initial data if empty
  if (getTable('car_models').length === 0) {
    const initialCarModels = [
      { id: '1', name: 'Maruti Swift', brand: 'Maruti Suzuki' },
      { id: '2', name: 'Hyundai Creta', brand: 'Hyundai' },
      { id: '3', name: 'Honda City', brand: 'Honda' },
      { id: '4', name: 'Toyota Innova', brand: 'Toyota' },
      { id: '5', name: 'Mahindra Thar', brand: 'Mahindra' },
    ];
    setTable('car_models', initialCarModels);
  }

  if (getTable('services').length === 0) {
    const initialServices = [
      // Good Year
      { id: '101', name: 'Good Year Assurance 185/65 R15', price: 5200, category: 'good-year', type: 'tubeless', description: 'TripleMax 2 Tubeless', hsn_code: '4011', gst_percentage: 28, discount_percentage: 0 },
      { id: '102', name: 'Good Year Kelly 165/80 R14', price: 3400, category: 'good-year', type: 'tube', description: 'Standard Tube Tyre', hsn_code: '4011', gst_percentage: 28, discount_percentage: 0 },
      // Bridgestone
      { id: '201', name: 'Bridgestone Sturdo 195/55 R16', price: 7800, category: 'bridgestone', type: 'tubeless', description: 'Long life tyre', hsn_code: '4011', gst_percentage: 28, discount_percentage: 5 },
      // MRF
      { id: '301', name: 'MRF ZVTV 175/65 R14', price: 4100, category: 'mrf', type: 'tubeless', description: 'Stock replacement', hsn_code: '4011', gst_percentage: 28, discount_percentage: 0 },
      { id: '302', name: 'MRF Wanderer 215/75 R15', price: 6500, category: 'mrf', type: 'tube', description: 'All terrain tube type', hsn_code: '4011', gst_percentage: 28, discount_percentage: 0 },
      // Michelin
      { id: '401', name: 'Michelin Primacy 4ST', price: 9200, category: 'michelin', type: 'tubeless', description: 'Premium comfort', hsn_code: '4011', gst_percentage: 28, discount_percentage: 2 },
    ];
    setTable('services', initialServices);
  }

  return {
    from: (table: string) => {
      let pendingData: any = null;
      let pendingFilter: any = null;
      let operation: 'select' | 'insert' | 'update' | 'delete' | 'upsert' | null = null;
      let selectedColumns: string | null = null;

      const chain = {
        select: (columns: string = '*') => {
          operation = 'select';
          selectedColumns = columns;
          return chain;
        },
        insert: (data: any[]) => {
          operation = 'insert';
          pendingData = data;
          return chain;
        },
        update: (data: any) => {
          operation = 'update';
          pendingData = data;
          return chain;
        },
        upsert: (data: any[]) => {
          operation = 'upsert';
          pendingData = data;
          return chain;
        },
        delete: () => {
          operation = 'delete';
          return chain;
        },
        match: (filter: any) => {
          pendingFilter = filter;
          return chain;
        },
        single: async () => {
          const result = await chain.execute();
          if (result.data && Array.isArray(result.data) && result.data.length > 0) {
            return { data: result.data[0], error: null };
          }
           if (result.data && !Array.isArray(result.data)) {
             return { data: result.data, error: null };
          }
          return { data: null, error: { message: 'No rows found' } };
        },
        then: (resolve: any, reject: any) => {
             return chain.execute().then(resolve, reject);
        },
        execute: async () => {
           await new Promise(r => setTimeout(r, 100)); // Simulate network delay
           const currentData = getTable(table);
           let resultData: any = null;

           if (operation === 'select') {
               let data = currentData;
               if (table === 'saved_bills' && selectedColumns?.includes('bill_items')) {
                   const billItems = getTable('bill_items');
                   data = data.map((bill: any) => ({
                       ...bill,
                       bill_items: billItems.filter((item: any) => item.bill_id === bill.id)
                   }));
               }

               if (pendingFilter) {
                   data = data.filter((row: any) => {
                       return Object.keys(pendingFilter).every(key => row[key] === pendingFilter[key]);
                   });
               }
               resultData = data;
           } else if (operation === 'insert') {
               const rows = pendingData.map((r: any) => ({ ...r, id: r.id || Math.random().toString(36).substr(2, 9) }));
               resultData = rows;
               setTable(table, [...currentData, ...rows]);
           } else if (operation === 'update') {
               if (pendingFilter) {
                   const updated = currentData.map((row: any) => {
                        const match = Object.keys(pendingFilter).every(key => row[key] === pendingFilter[key]);
                        if (match) return { ...row, ...pendingData };
                        return row;
                   });
                   setTable(table, updated);

                    resultData = updated.filter((row: any) =>
                        Object.keys(pendingFilter).every(key => row[key] === pendingFilter[key])
                    );
               }
           } else if (operation === 'delete') {
               if (pendingFilter) {
                   const filtered = currentData.filter((row: any) => {
                        return !Object.keys(pendingFilter).every(key => row[key] === pendingFilter[key]);
                   });
                   setTable(table, filtered);
               }
           } else if (operation === 'upsert') {
                const rows = Array.isArray(pendingData) ? pendingData : [pendingData];
                let newData = [...currentData];
                rows.forEach((row: any) => {
                    const idx = newData.findIndex(r => r.id === row.id);
                    if (idx >= 0) {
                        newData[idx] = { ...newData[idx], ...row };
                    } else {
                        newData.push({ ...row, id: row.id || Math.random().toString(36).substr(2, 9) });
                    }
                });
                setTable(table, newData);
                resultData = rows;
           }

           return { data: resultData, error: null };
        }
      };
      return chain;
    }
  };
};

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();
