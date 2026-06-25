import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getGroups,
  getUserGroups,
  joinGroup,
  leaveGroup,
  createGroup,
  deleteGroup,
  subscribeToFocusingCounts,
} from "@/services/group.service";
import { useAuthStore } from "@/store/auth.store";
import type { Group, CreateGroupPayload } from "@/types/group.types";

export function useCommunity() {
  const user = useAuthStore((state) => state.user);

  const [groups, setGroups] = useState<Group[]>([]);
  const [joinedGroupIds, setJoinedGroupIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [focusingCounts, setFocusingCounts] = useState<Record<string, number>>({});

  // Derive unique categories from fetched groups (no hardcoding)
  const categories = useMemo(() => {
    const categorySet = new Set<string>();

    groups.forEach((g) => {
      if (g.category) {
        categorySet.add(g.category);
      }
    });

    return Array.from(categorySet).sort();
  }, [groups]);

  const fetchGroups = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      setError(null);

      const [allGroups, userGroupIds] = await Promise.all([
        getGroups(),
        getUserGroups(user.uid),
      ]);

      setGroups(allGroups);
      setJoinedGroupIds(new Set(userGroupIds));
    } catch (err) {
      console.error("Failed to fetch groups:", err);
      setError("Failed to load study halls. Pull down to retry.");
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Subscribe to real-time focusing counts
  useEffect(() => {
    const unsubscribe = subscribeToFocusingCounts(setFocusingCounts);
    return unsubscribe;
  }, []);

  const handleJoin = async (groupId: string) => {
    if (!user?.uid || actionLoading) return;

    try {
      setActionLoading(groupId);
      await joinGroup(groupId, user.uid);

      setJoinedGroupIds((prev) => new Set([...prev, groupId]));
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId ? { ...g, memberCount: g.memberCount + 1 } : g
        )
      );
    } catch (err) {
      console.error("Failed to join group:", err);
      setError("Failed to join group. Try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeave = async (groupId: string) => {
    if (!user?.uid || actionLoading) return;

    try {
      setActionLoading(groupId);
      await leaveGroup(groupId, user.uid);

      setJoinedGroupIds((prev) => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? { ...g, memberCount: Math.max(0, g.memberCount - 1) }
            : g
        )
      );
    } catch (err) {
      console.error("Failed to leave group:", err);
      setError("Failed to leave group. Try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreate = async (
    name: string,
    description: string,
    category: string
  ) => {
    if (!user?.uid) return;

    try {
      setActionLoading("creating");

      const payload: CreateGroupPayload = {
        name,
        description,
        category,
        createdBy: user.uid,
      };

      const newGroupId = await createGroup(payload);

      const newGroup: Group = {
        id: newGroupId,
        name,
        description,
        category,
        memberCount: 1,
        createdBy: user.uid,
      };

      setGroups((prev) => [newGroup, ...prev]);
      setJoinedGroupIds((prev) => new Set([...prev, newGroupId]));
    } catch (err) {
      console.error("Failed to create group:", err);
      setError("Failed to create study hall. Try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (groupId: string) => {
    if (!user?.uid || actionLoading) return;

    try {
      setActionLoading(groupId);
      await deleteGroup(groupId);

      setGroups((prev) => prev.filter((g) => g.id !== groupId));
      setJoinedGroupIds((prev) => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
    } catch (err) {
      console.error("Failed to delete group:", err);
      setError("Failed to delete study hall. Try again.");
    } finally {
      setActionLoading(null);
    }
  };

  return {
    groups,
    joinedGroupIds,
    categories,
    focusingCounts,
    loading,
    actionLoading,
    error,
    userId: user?.uid ?? null,
    refresh: fetchGroups,
    join: handleJoin,
    leave: handleLeave,
    create: handleCreate,
    remove: handleDelete,
  };
}
