import { useQuery } from '@tanstack/react-query';
import { queryOptions } from './menu.query';

const useMenuList = () => useQuery(queryOptions.list());
const useMenuByUserUid = (userUid: number) => useQuery(queryOptions.findByUserUid({ userUid }));

export { useMenuList, useMenuByUserUid };
