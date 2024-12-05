import { http, HttpResponse } from 'msw';

// 타입 정의
interface Avatar {
    id: number;
    memberId: number;
    hat: Item | null;
    pet: Item | null;
    background: Item | null;
  }
  
interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    category: "hat" | "pet" | "background";
    isEquipped: boolean;
  }
  
  interface PurchaseRequestBody {
    itemId: number;
  }

  interface ItemEquipRequestBody {
    memberId: number;
    itemId: number;
}

interface ItemRemoveRequestBody {
   itemId: number;
}

let mockAvatar: Avatar = {
  id: 1,
  memberId: 1,
  hat: null,
  pet: null,
  background: null,
};

let mockItems: Item[] = [
  {
    id: 1,
    name: "Cute Hat",
    description: "A cute hat to wear.",
    price: 10,
    category: "hat",
    isEquipped: false,
  },
  {
    id: 2,
    name: "Adorable Pet",
    description: "A pet to accompany you.",
    price: 20,
    category: "pet",
    isEquipped: false,
  },
  {
    id: 3,
    name: "Beautiful Background",
    description: "A background to customize your profile.",
    price: 15,
    category: "background",
    isEquipped: false,
  },
];

// Handlers
export const avatarHandlers = [
  // 아이템 구매 핸들러
  http.post('/api/v1/member/avatar/purchase', async ({ request }) => {
    const body = (await request.json()) as PurchaseRequestBody;
    const { itemId } = body;

    const item = mockItems.find((item) => item.id === itemId);

    if (!item) {
      return new HttpResponse(
        JSON.stringify({ error: "Item not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 구매된 아이템으로 mock 데이터 업데이트
    item.isEquipped = false;

    console.log(`MSW: Item purchased - ID: ${itemId}`);
    return new HttpResponse(
      JSON.stringify({ message: "Item purchased successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),

  // 아이템 장착 핸들러
  http.post('/api/v1/member/avatar/isEquipped', async ({ request }) => {
    const body = (await request.json()) as ItemEquipRequestBody;
    const { itemId } = body;

    const item = mockItems.find((item) => item.id === itemId);

    if (!item) {
      return new HttpResponse(
        JSON.stringify({ error: "Item not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    switch (item.category) {
      case "hat":
        mockAvatar.hat = item;
        break;
      case "pet":
        mockAvatar.pet = item;
        break;
      case "background":
        mockAvatar.background = item;
        break;
      default:
        return new HttpResponse(
          JSON.stringify({ error: "Invalid item category." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    console.log(`MSW: Item equipped - ID: ${itemId}`);
    return new HttpResponse(
      JSON.stringify({ message: "Item equipped successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),

  // 아이템 해제 핸들러
  http.post('/api/v1/member/avatar/remove', async ({ request }) => {
    const body = (await request.json()) as ItemRemoveRequestBody;
    const { itemId } = body;

    const item = mockItems.find((item) => item.id === itemId);

    if (!item) {
      return new HttpResponse(
        JSON.stringify({ error: "Item not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    switch (item.category) {
      case "hat":
        mockAvatar.hat = null;
        break;
      case "pet":
        mockAvatar.pet = null;
        break;
      case "background":
        mockAvatar.background = null;
        break;
      default:
        return new HttpResponse(
          JSON.stringify({ error: "Invalid item category." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    console.log(`MSW: Item unequipped - ID: ${itemId}`);
    return new HttpResponse(
      JSON.stringify({ message: "Item unequipped successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),

  // 아바타 조회 핸들러
  http.get('/api/v1/member/avatar/read', () => {
    console.log("MSW: Fetching avatar data");
    return new HttpResponse(
      JSON.stringify(mockAvatar),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),
];
