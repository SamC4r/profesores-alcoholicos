import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, beforeEach, it, expect } from "vitest";

vi.mock("@/hooks/use-mobile", () => ({ useIsMobile: () => false }));

const invalidateMock = vi.fn();
const sendRequestMock = vi.fn();

vi.mock("@/lib/auth-client", () => ({
  useSession: () => ({ data: { user: { id: "FnMfljwGe36vzHBMPmJs2SsxA3jPRpzV" } } }),
  authClient: { signOut: vi.fn() },
}));
vi.mock("../components/image-upload-modal", () => ({
  ThumbnailUploadModal: () => null,
}));

vi.mock("@/trpc/client", () => ({
  trpc: {
    useUtils: () => ({
      users: { getFriendship: { invalidate: invalidateMock } },
    }),
    users: {
      getOne: {
        useQuery: () => ({
          data: {
            user: {
              id: "FnMfljwGe36vzHBMPmJs2SsxA3jPRpzV",
              name: "Samuel Caraballo",
              username: "samuel.caraballo",
              imageUrl: null,
              bio: "",
            },
          },
        }),
      },
      getFriends: {
        useSuspenseQuery: () =>
          ([
            [
              {
                userA: { id: "FnMfljwGe36vzHBMPmJs2SsxA3jPRpzV", name: "Samuel", username: "samuel" },
                userB: { id: "WT2SPYqAMPHXxDWUj7KuLU", name: "Samuel Caraballo Chichiraldi", username: "sammas24" },
              },
            ],
          ] as any),
      },
      getPending: { useSuspenseQuery: () => ([[]] as any) },
      getDegustaciones: { useSuspenseQuery: () => ([[]] as any) },
      getFriendship: { useQuery: () => ({ data: [] }) },
      sendRequest: {
        useMutation: (opts: any) => ({
          mutate: (payload: any) => {
            sendRequestMock(payload);
            opts?.onSuccess?.();
          },
          isPending: false,
        }),
      },
    },
  },
}));

let UsersViewSuspense: any;

beforeEach(async () => {
  invalidateMock.mockClear();
  sendRequestMock.mockClear();
  ({ UsersViewSuspense } = await import("./users-view"));
});

it("renders user header and friend list", () => {
  render(<UsersViewSuspense userId="FnMfljwGe36vzHBMPmJs2SsxA3jPRpzV" />);

  expect(screen.getByText("Samuel Caraballo")).toBeInTheDocument();
  expect(screen.getByText("@samuel.caraballo")).toBeInTheDocument();

  expect(screen.getByText("Samuel Caraballo Chichiraldi")).toBeInTheDocument();
});

it("shows 'Añadir amigo' when viewing someone else and calls mutation", async () => {
  const user = userEvent.setup();

  render(<UsersViewSuspense userId="other-user" />);

  await user.click(screen.getByRole("button", { name: /Añadir amigo/i }));

  expect(sendRequestMock).toHaveBeenCalledWith({ toUserId: "other-user" });
  expect(invalidateMock).toHaveBeenCalled();
});

