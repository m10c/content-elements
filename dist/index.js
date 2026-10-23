import {
  preview_device_widths_default,
  preview_message_default,
  usePreviewReceiver,
  usePreviewSender,
  useWebsiteGlobalData,
  useWebsitePageData
} from "./chunk-BQUCQ6S3.js";

// src/components/AddBlockDialog.tsx
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack
} from "@mui/material";
import { jsx, jsxs } from "react/jsx-runtime";
function AddBlockDialog({
  open,
  onClose,
  blockTypes,
  onSelect,
  icons,
  title = "Add block"
}) {
  return /* @__PURE__ */ jsxs(Dialog, { open, onClose, maxWidth: "xs", fullWidth: true, children: [
    /* @__PURE__ */ jsx(DialogTitle, { children: /* @__PURE__ */ jsxs(
      Stack,
      {
        direction: "row",
        alignItems: "center",
        justifyContent: "space-between",
        children: [
          title,
          /* @__PURE__ */ jsx(IconButton, { onClick: onClose, size: "small", "aria-label": "Close", children: /* @__PURE__ */ jsx(CloseIcon, {}) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(DialogContent, { sx: { px: 1, pb: 2 }, children: /* @__PURE__ */ jsx(List, { disablePadding: true, children: blockTypes.map((blockType) => /* @__PURE__ */ jsxs(
      ListItemButton,
      {
        onClick: () => {
          onSelect(blockType);
          onClose();
        },
        children: [
          icons?.[blockType.key] && /* @__PURE__ */ jsx(ListItemIcon, { children: icons[blockType.key] }),
          /* @__PURE__ */ jsx(ListItemText, { primary: blockType.label })
        ]
      },
      blockType.key
    )) }) })
  ] });
}

// src/components/BlockCardFrame.tsx
import { Box, Card, Stack as Stack2, Typography } from "@mui/material";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function BlockCardFrame({
  gutter,
  title,
  action,
  children,
  sx,
  ...cardProps
}) {
  return /* @__PURE__ */ jsxs2(
    Card,
    {
      ...cardProps,
      sx: [
        { display: "flex", gap: 1, pt: 2, pb: 3, pl: gutter ? 0 : 3 },
        ...Array.isArray(sx) ? sx : [sx]
      ],
      children: [
        gutter && /* @__PURE__ */ jsx2(Box, { sx: { display: "flex", p: 1, color: "text.secondary" }, children: gutter }),
        /* @__PURE__ */ jsxs2(Stack2, { spacing: 2, sx: { flex: 1, minWidth: 0, pr: 2 }, children: [
          (title || action) && /* @__PURE__ */ jsxs2(
            Stack2,
            {
              direction: "row",
              alignItems: "center",
              justifyContent: "space-between",
              spacing: 1,
              sx: { minHeight: 40 },
              children: [
                /* @__PURE__ */ jsx2(Typography, { variant: "h6", children: title }),
                action
              ]
            }
          ),
          children
        ] })
      ]
    }
  );
}

// src/components/BlocksField.tsx
import { Stack as Stack10 } from "@mui/material";
import React6 from "react";

// src/hooks/use-keyed-list.ts
import React from "react";

// src/utils/move-item.ts
function moveItem(items, from, to) {
  const updated = items.slice();
  const [moved] = updated.splice(from, 1);
  if (moved === void 0) return updated;
  updated.splice(to, 0, moved);
  return updated;
}

// src/hooks/use-keyed-list.ts
function useKeyedList(items, onChange) {
  const nextKeyRef = React.useRef(0);
  const keysRef = React.useRef([]);
  if (keysRef.current.length !== items.length) {
    keysRef.current = Array.from(
      { length: items.length },
      (_, index) => keysRef.current[index] ?? `item-${nextKeyRef.current++}`
    );
  }
  return {
    keys: keysRef.current,
    replace: (index, next) => {
      const updated = items.slice();
      updated[index] = next;
      onChange(updated);
    },
    remove: (index) => {
      keysRef.current = keysRef.current.filter((_, i) => i !== index);
      onChange(items.filter((_, i) => i !== index));
    },
    move: (from, to) => {
      keysRef.current = moveItem(keysRef.current, from, to);
      onChange(moveItem(items, from, to));
    }
  };
}

// src/components/BlockCard.tsx
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon2 from "@mui/icons-material/DragIndicator";
import {
  Box as Box4,
  Card as Card2,
  CardContent,
  IconButton as IconButton4,
  Stack as Stack8,
  Typography as Typography8
} from "@mui/material";
import React5 from "react";

// src/hooks/use-sortable-item.ts
import { useSortable } from "@dnd-kit/sortable";
function useSortableItem(id, disabled = false) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, disabled });
  return {
    itemProps: {
      ref: setNodeRef,
      style: {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : void 0,
        transition,
        position: "relative",
        opacity: isDragging ? 0 : void 0
      }
    },
    // Only the handle starts a drag, so text inside the item stays selectable.
    handleProps: {
      ref: setActivatorNodeRef,
      ...attributes,
      ...listeners,
      style: { touchAction: "none", cursor: "grab" }
    }
  };
}

// src/components/ListFieldRenderer.tsx
import AddIcon from "@mui/icons-material/Add";
import { Button as Button2, Divider as Divider2, Stack as Stack7, Typography as Typography7 } from "@mui/material";
import React4 from "react";

// src/utils/empty-field-value.ts
function emptyFieldValue(fieldDef) {
  if (fieldDef.kind === "list") return [];
  if (fieldDef.kind === "boolean") return false;
  return "";
}

// src/utils/field-label.ts
function fieldLabel(fieldDef, fallback) {
  return `${fieldDef.label ?? fallback}${fieldDef.required ? "*" : ""}`;
}

// src/components/ListItemCard.tsx
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box as Box2, IconButton as IconButton2, Stack as Stack4, Typography as Typography4 } from "@mui/material";

// src/components/FieldError.tsx
import { Typography as Typography2 } from "@mui/material";
import { jsx as jsx3 } from "react/jsx-runtime";
function FieldError({ error }) {
  return /* @__PURE__ */ jsx3(Typography2, { variant: "caption", color: "error.main", children: error });
}

// src/components/FieldNote.tsx
import { Stack as Stack3, Typography as Typography3 } from "@mui/material";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function FieldNote({
  fieldDef,
  label
}) {
  return /* @__PURE__ */ jsxs3(Stack3, { spacing: 0.5, children: [
    fieldDef.label && /* @__PURE__ */ jsx4(Typography3, { variant: "subtitle1", children: label }),
    /* @__PURE__ */ jsx4(Typography3, { variant: "body2", color: "text.secondary", children: fieldDef.text })
  ] });
}

// src/components/ListItemCard.tsx
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
function ListItemCard({
  sortableId,
  fieldDef,
  item,
  previews,
  icons,
  errors,
  onEdit
}) {
  const { itemProps, handleProps } = useSortableItem(sortableId);
  return /* @__PURE__ */ jsxs4(
    Stack4,
    {
      ...itemProps,
      direction: "row",
      spacing: 1,
      alignItems: "flex-start",
      sx: { p: 2, borderRadius: 1, bgcolor: "grey.100" },
      children: [
        /* @__PURE__ */ jsx5(Box2, { ...handleProps, sx: { display: "flex", color: "primary.main" }, children: icons?.drag ?? /* @__PURE__ */ jsx5(DragIndicatorIcon, { fontSize: "small" }) }),
        /* @__PURE__ */ jsx5(Stack4, { spacing: 1.5, sx: { flex: 1, minWidth: 0 }, children: Object.entries(fieldDef.itemFields).map(([subKey, subFieldDef]) => {
          const label = fieldLabel(subFieldDef, subKey);
          if (subFieldDef.kind === "note") {
            return /* @__PURE__ */ jsx5(FieldNote, { fieldDef: subFieldDef, label }, subKey);
          }
          const value = typeof item[subKey] === "string" ? item[subKey] : null;
          const preview = previews?.[subFieldDef.kind];
          return /* @__PURE__ */ jsxs4(Stack4, { spacing: 0.5, children: [
            /* @__PURE__ */ jsx5(Typography4, { variant: "body2", color: "text.secondary", children: label }),
            preview ? preview(value) : /* @__PURE__ */ jsx5(Typography4, { variant: "body1", children: fieldSummary(subFieldDef, item[subKey]) }),
            errors?.[subKey] && /* @__PURE__ */ jsx5(FieldError, { error: errors[subKey] })
          ] }, subKey);
        }) }),
        /* @__PURE__ */ jsx5(
          IconButton2,
          {
            size: "small",
            onClick: onEdit,
            "aria-label": "Edit item",
            sx: { color: "primary.main" },
            children: icons?.edit ?? /* @__PURE__ */ jsx5(EditOutlinedIcon, { fontSize: "small" })
          }
        )
      ]
    }
  );
}
function fieldSummary(fieldDef, value) {
  if (fieldDef.kind === "boolean") return value === true ? "Yes" : "No";
  if (typeof value !== "string") return null;
  return fieldDef.kind === "richtext" || fieldDef.kind === "markdown" ? plainText(value) : value;
}
function plainText(html) {
  return html.replace(/<br\s*\/?>/gi, " ").replace(/<\/(p|div|li|h[1-6])>/gi, " ").replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/\s+/g, " ").trim();
}

// src/components/ListItemDialog.tsx
import CloseIcon2 from "@mui/icons-material/Close";
import {
  Button,
  Dialog as Dialog2,
  DialogActions,
  DialogContent as DialogContent2,
  DialogTitle as DialogTitle2,
  Divider,
  IconButton as IconButton3,
  Stack as Stack6,
  Typography as Typography6
} from "@mui/material";
import React2 from "react";

// src/components/SimpleFieldRenderer.tsx
import { InputAdornment, Stack as Stack5, Typography as Typography5 } from "@mui/material";
import { FieldRadioGroup, FieldSwitch, FieldText } from "@m10c/mui-kit";
import { Fragment, jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
function fieldHint(fieldDef) {
  if (fieldDef.hint) return fieldDef.hint;
  return fieldDef.dimensions ? `Recommended size ${fieldDef.dimensions}px` : void 0;
}
function SimpleFieldRenderer({
  fieldKey,
  fieldDef,
  value,
  renderers,
  labelOverride,
  error,
  onChange
}) {
  const label = labelOverride ?? fieldLabel(fieldDef, fieldKey);
  if (fieldDef.kind === "note") {
    return /* @__PURE__ */ jsx6(FieldNote, { fieldDef, label });
  }
  const stringValue = typeof value === "string" ? value : null;
  const isOn = value === true;
  const customRenderer = renderers?.[fieldDef.kind];
  if (customRenderer) {
    return /* @__PURE__ */ jsx6(Fragment, { children: customRenderer({
      name: fieldKey,
      label,
      value: stringValue,
      features: fieldDef.features,
      hint: fieldHint(fieldDef),
      prefix: fieldDef.prefix,
      error,
      values: stringValues(value),
      maxItems: fieldDef.maxItems,
      checked: isOn,
      onChange,
      onChangeValues: onChange,
      onChangeChecked: onChange
    }) });
  }
  if (fieldDef.kind === "boolean") {
    return /* @__PURE__ */ jsx6(FieldWrap, { fieldDef, error, children: /* @__PURE__ */ jsx6(
      FieldSwitch,
      {
        field: {
          name: fieldKey,
          label,
          value: isOn,
          handleValueChange: onChange
        }
      }
    ) });
  }
  if (fieldDef.kind === "select") {
    return /* @__PURE__ */ jsx6(FieldWrap, { fieldDef, label, error, children: /* @__PURE__ */ jsx6(
      FieldRadioGroup,
      {
        field: {
          name: fieldKey,
          label,
          value: stringValue ?? "",
          handleValueChange: onChange
        },
        options: (fieldDef.options ?? []).map((option) => ({
          value: option,
          label: option
        }))
      }
    ) });
  }
  if (fieldDef.kind === "images") {
    return /* @__PURE__ */ jsx6(FieldWrap, { fieldDef, label, error });
  }
  const fieldProp = {
    name: fieldKey,
    label,
    value: stringValue,
    handleValueChange: onChange,
    errorList: error === void 0 ? void 0 : [error]
  };
  const multiline = fieldDef.kind === "textarea" || fieldDef.kind === "markdown" || fieldDef.kind === "richtext";
  return /* @__PURE__ */ jsx6(FieldWrap, { fieldDef, label, children: /* @__PURE__ */ jsx6(
    FieldText,
    {
      field: fieldProp,
      hiddenLabel: true,
      multiline,
      minRows: multiline ? 2 : void 0,
      InputProps: fieldDef.prefix ? {
        startAdornment: /* @__PURE__ */ jsx6(InputAdornment, { position: "start", children: fieldDef.prefix })
      } : void 0,
      inputProps: fieldDef.maxLength ? { maxLength: fieldDef.maxLength } : void 0
    }
  ) });
}
function FieldWrap({ fieldDef, label, error, children }) {
  return /* @__PURE__ */ jsxs5(Stack5, { spacing: 1, children: [
    /* @__PURE__ */ jsxs5(Stack5, { spacing: 0.5, children: [
      label && /* @__PURE__ */ jsx6(Typography5, { variant: "subtitle2", children: label }),
      fieldHint(fieldDef) && /* @__PURE__ */ jsx6(Typography5, { variant: "body2", color: "text.secondary", children: fieldHint(fieldDef) })
    ] }),
    children,
    error && /* @__PURE__ */ jsx6(FieldError, { error })
  ] });
}
function stringValues(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

// src/components/ListItemDialog.tsx
import { Fragment as Fragment2, jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
function ListItemDialog({
  title,
  fieldDef,
  item,
  renderers,
  errors,
  confirmLabel,
  onDelete,
  onConfirm,
  onClose
}) {
  const [draft, setDraft] = React2.useState(item);
  return /* @__PURE__ */ jsxs6(Dialog2, { open: true, fullWidth: true, maxWidth: "xs", onClose, children: [
    /* @__PURE__ */ jsxs6(DialogTitle2, { sx: { pr: 6 }, children: [
      title,
      /* @__PURE__ */ jsx7(
        IconButton3,
        {
          size: "small",
          onClick: onClose,
          "aria-label": "Close",
          sx: { position: "absolute", right: 12, top: 12 },
          children: /* @__PURE__ */ jsx7(CloseIcon2, { fontSize: "small" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx7(DialogContent2, { dividers: true, children: /* @__PURE__ */ jsxs6(Stack6, { spacing: 2, sx: { pt: 1 }, children: [
      !!fieldDef.variables?.length && /* @__PURE__ */ jsxs6(
        Stack6,
        {
          spacing: 1,
          sx: { p: 2, borderRadius: 1, bgcolor: "grey.100" },
          children: [
            /* @__PURE__ */ jsx7(Typography6, { variant: "subtitle2", children: "Variables to use" }),
            /* @__PURE__ */ jsx7(
              Stack6,
              {
                direction: "row",
                spacing: 2,
                divider: /* @__PURE__ */ jsx7(Divider, { flexItem: true, orientation: "vertical" }),
                children: fieldDef.variables.map((variable) => /* @__PURE__ */ jsxs6(Stack6, { spacing: 0.5, sx: { flex: 1 }, children: [
                  /* @__PURE__ */ jsx7(Typography6, { variant: "body2", children: variable.token }),
                  /* @__PURE__ */ jsx7(Typography6, { variant: "caption", color: "text.secondary", children: variable.description })
                ] }, variable.token))
              }
            )
          ]
        }
      ),
      Object.entries(fieldDef.itemFields).map(([subKey, subFieldDef]) => /* @__PURE__ */ jsx7(
        SimpleFieldRenderer,
        {
          fieldKey: subKey,
          fieldDef: subFieldDef,
          value: draft[subKey],
          renderers,
          error: errors?.[subKey],
          onChange: (subValue) => setDraft({ ...draft, [subKey]: subValue })
        },
        subKey
      ))
    ] }) }),
    /* @__PURE__ */ jsx7(DialogActions, { sx: { p: 2 }, children: onDelete ? /* @__PURE__ */ jsxs6(Fragment2, { children: [
      /* @__PURE__ */ jsx7(Button, { variant: "outlined", color: "error", onClick: onDelete, children: "Delete" }),
      /* @__PURE__ */ jsx7(Button, { variant: "contained", onClick: () => onConfirm(draft), children: confirmLabel })
    ] }) : /* @__PURE__ */ jsx7(
      Button,
      {
        fullWidth: true,
        variant: "contained",
        onClick: () => onConfirm(draft),
        children: confirmLabel
      }
    ) })
  ] });
}

// src/components/SortableList.tsx
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

// src/utils/pointer-insertion.ts
import { closestCenter } from "@dnd-kit/core";
var pointerInsertion = (args) => {
  const { active, droppableContainers, droppableRects, pointerCoordinates } = args;
  if (!pointerCoordinates) return closestCenter(args);
  const items = droppableContainers.flatMap((container) => {
    const rect = droppableRects.get(container.id);
    return rect ? [{ container, rect }] : [];
  }).sort((a, b) => a.rect.top - b.rect.top);
  const from = items.findIndex(({ container }) => container.id === active.id);
  const next = items[from + 1];
  const activeItem = items[from];
  const removedGap = activeItem && next ? next.rect.top - activeItem.rect.top : 0;
  const to = items.filter(({ rect }, index) => {
    if (index === from) return false;
    const top = index > from ? rect.top - removedGap : rect.top;
    return pointerCoordinates.y > top + rect.height / 2;
  }).length;
  const target = items[to];
  return target ? [
    {
      id: target.container.id,
      data: { droppableContainer: target.container }
    }
  ] : [];
};
var pointer_insertion_default = pointerInsertion;

// src/components/SortableDragPreview.tsx
import { DragOverlay, useDndContext } from "@dnd-kit/core";
import { Box as Box3 } from "@mui/material";
import React3 from "react";
import { jsx as jsx8 } from "react/jsx-runtime";
function SortableDragPreview() {
  const { activeNode } = useDndContext();
  return /* @__PURE__ */ jsx8(DragOverlay, { style: { margin: 0 }, children: activeNode && /* @__PURE__ */ jsx8(ElementPreview, { element: activeNode }) });
}
function ElementPreview({ element }) {
  const containerRef = React3.useRef(null);
  React3.useLayoutEffect(() => {
    const clone = element.cloneNode(true);
    if (!(clone instanceof HTMLElement)) return;
    clone.style.opacity = "";
    clone.style.transform = "";
    copyFieldValues(element, clone);
    containerRef.current?.replaceChildren(clone);
  }, [element]);
  return /* @__PURE__ */ jsx8(
    Box3,
    {
      ref: containerRef,
      sx: { width: element.offsetWidth, cursor: "grabbing" }
    }
  );
}
function copyFieldValues(source, clone) {
  const selector = "input, textarea, select";
  const sourceFields = source.querySelectorAll(selector);
  clone.querySelectorAll(selector).forEach((field, index) => {
    const sourceField = sourceFields[index];
    if (hasValue(field) && hasValue(sourceField)) {
      field.value = sourceField.value;
    }
  });
}
function hasValue(element) {
  return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement;
}

// src/components/SortableList.tsx
import { jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
function SortableList({ ids, onMove, children }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  return /* @__PURE__ */ jsxs7(
    DndContext,
    {
      sensors,
      collisionDetection: pointer_insertion_default,
      onDragEnd: ({ active, over }) => {
        if (!over || active.id === over.id) return;
        const from = ids.indexOf(String(active.id));
        const to = ids.indexOf(String(over.id));
        if (from === -1 || to === -1) return;
        onMove(from, to);
      },
      children: [
        /* @__PURE__ */ jsx9(SortableContext, { items: ids, strategy: verticalListSortingStrategy, children }),
        /* @__PURE__ */ jsx9(SortableDragPreview, {})
      ]
    }
  );
}

// src/components/ListFieldRenderer.tsx
import { jsx as jsx10, jsxs as jsxs8 } from "react/jsx-runtime";
function emptyItem(fieldDef) {
  return Object.fromEntries(
    Object.entries(fieldDef.itemFields).map(([key, subFieldDef]) => [
      key,
      emptyFieldValue(subFieldDef)
    ])
  );
}
function ListFieldRenderer(props) {
  return props.fieldDef.variant === "inline" ? /* @__PURE__ */ jsx10(ListInline, { ...props }) : /* @__PURE__ */ jsx10(ListCards, { ...props });
}
function ListInline({
  fieldDef,
  value: items,
  renderers,
  errors,
  errorPath,
  onChange
}) {
  const itemLabel = fieldDef.itemLabel ?? fieldDef.label ?? "Item";
  const { keys, replace } = useKeyedList(items, onChange);
  return /* @__PURE__ */ jsx10(Stack7, { spacing: 2, children: items.map((item, index) => /* @__PURE__ */ jsxs8(React4.Fragment, { children: [
    index > 0 && /* @__PURE__ */ jsx10(Divider2, {}),
    Object.entries(fieldDef.itemFields).map(([subKey, subFieldDef]) => /* @__PURE__ */ jsx10(
      SimpleFieldRenderer,
      {
        fieldKey: subKey,
        fieldDef: subFieldDef,
        value: item[subKey],
        renderers,
        labelOverride: `${fieldLabel(subFieldDef, subKey)} ${itemLabel} ${index + 1}`,
        error: errors?.[`${errorPath}.${index}.${subKey}`],
        onChange: (subValue) => replace(index, { ...item, [subKey]: subValue })
      },
      subKey
    ))
  ] }, keys[index])) });
}
function ListCards({
  fieldDef,
  value: items,
  renderers,
  previews,
  icons,
  errors,
  errorPath,
  headerSlot,
  onChange
}) {
  const [editedIndex, setEditedIndex] = React4.useState(null);
  const [isAdding, setIsAdding] = React4.useState(false);
  const itemLabel = fieldDef.itemLabel ?? "item";
  const editedItem = editedIndex === null ? void 0 : items[editedIndex];
  const { maxItems, minItems } = fieldDef;
  const isFull = maxItems !== void 0 && items.length >= maxItems;
  const canDelete = items.length > (minItems ?? 0);
  const isFixedLength = minItems !== void 0 && minItems === maxItems;
  function itemErrors(index) {
    const prefix = `${errorPath}.${index}.`;
    return Object.fromEntries(
      Object.entries(errors ?? {}).filter(([path]) => path.startsWith(prefix)).map(([path, message]) => [path.slice(prefix.length), message])
    );
  }
  const { keys, replace, remove, move } = useKeyedList(items, onChange);
  return /* @__PURE__ */ jsxs8(Stack7, { spacing: 1.5, children: [
    !isFixedLength && /* @__PURE__ */ jsxs8(
      Stack7,
      {
        direction: "row",
        alignItems: "center",
        justifyContent: "space-between",
        children: [
          /* @__PURE__ */ jsx10(Typography7, { variant: "subtitle1", children: fieldLabel(fieldDef, itemLabel) }),
          /* @__PURE__ */ jsx10(
            Button2,
            {
              size: "small",
              startIcon: /* @__PURE__ */ jsx10(AddIcon, {}),
              disabled: isFull,
              onClick: () => setIsAdding(true),
              children: "Add"
            }
          )
        ]
      }
    ),
    maxItems !== void 0 && !isFixedLength && /* @__PURE__ */ jsxs8(Typography7, { variant: "body2", color: "text.secondary", children: [
      items.length,
      " of ",
      maxItems,
      " ",
      itemLabel,
      "(s) added. You can add up to",
      " ",
      maxItems,
      " ",
      itemLabel,
      "s."
    ] }),
    headerSlot,
    /* @__PURE__ */ jsx10(SortableList, { ids: keys, onMove: move, children: items.map((item, index) => {
      const key = keys[index];
      if (key === void 0) {
        throw new Error(`List item ${index} has no key`);
      }
      return /* @__PURE__ */ jsx10(
        ListItemCard,
        {
          sortableId: key,
          fieldDef,
          item,
          previews,
          icons,
          errors: itemErrors(index),
          onEdit: () => setEditedIndex(index)
        },
        key
      );
    }) }),
    editedIndex !== null && editedItem !== void 0 && /* @__PURE__ */ jsx10(
      ListItemDialog,
      {
        title: `Edit ${fieldDef.label ?? itemLabel}`,
        fieldDef,
        item: editedItem,
        renderers,
        errors: itemErrors(editedIndex),
        confirmLabel: "Save",
        onDelete: canDelete ? () => {
          remove(editedIndex);
          setEditedIndex(null);
        } : void 0,
        onConfirm: (next) => {
          replace(editedIndex, next);
          setEditedIndex(null);
        },
        onClose: () => setEditedIndex(null)
      }
    ),
    isAdding && /* @__PURE__ */ jsx10(
      ListItemDialog,
      {
        title: `Add ${fieldDef.label ?? itemLabel}`,
        fieldDef,
        item: emptyItem(fieldDef),
        renderers,
        confirmLabel: "Create",
        onConfirm: (next) => {
          onChange([...items, next]);
          setIsAdding(false);
        },
        onClose: () => setIsAdding(false)
      }
    )
  ] });
}

// src/components/BlockFieldRenderer.tsx
import { jsx as jsx11 } from "react/jsx-runtime";
function BlockFieldRenderer({
  fieldKey,
  fieldDef,
  value,
  renderers,
  previews,
  icons,
  errors,
  errorPath,
  headerSlot,
  onChange
}) {
  if (fieldDef.kind === "list") {
    return /* @__PURE__ */ jsx11(
      ListFieldRenderer,
      {
        fieldDef,
        value: Array.isArray(value) ? value : [],
        renderers,
        previews,
        icons,
        errors,
        errorPath,
        headerSlot,
        onChange
      }
    );
  }
  return /* @__PURE__ */ jsx11(
    SimpleFieldRenderer,
    {
      fieldKey,
      fieldDef,
      value,
      renderers,
      error: errors?.[errorPath],
      onChange
    }
  );
}

// src/components/BlockCard.tsx
import { Fragment as Fragment3, jsx as jsx12, jsxs as jsxs9 } from "react/jsx-runtime";
function BlockCard({
  sortableId,
  elementRef,
  block,
  blockType,
  component: BlockComponent,
  renderers,
  previews,
  icons,
  errors,
  errorPath,
  canReorder,
  onChange,
  onDelete
}) {
  const { itemProps, handleProps } = useSortableItem(sortableId, !canReorder);
  const [headerActionContainer, setHeaderActionContainer] = React5.useState(null);
  function updateData(key, value) {
    onChange({ ...block, data: { ...block.data, [key]: value } });
  }
  const fields = blockType?.fields ?? {};
  const headerFieldKeys = new Set(
    Object.values(fields).flatMap(
      (fieldDef) => fieldDef.kind === "list" ? fieldDef.headerFieldKeys ?? [] : []
    )
  );
  function renderHeaderFields(fieldDef) {
    if (fieldDef.kind !== "list" || !fieldDef.headerFieldKeys?.length) {
      return void 0;
    }
    const claimed = fieldDef.headerFieldKeys;
    return /* @__PURE__ */ jsx12(Fragment3, { children: Object.entries(fields).filter(([key]) => claimed.includes(key)).map(
      ([key, headerFieldDef]) => headerFieldDef.kind === "list" ? null : /* @__PURE__ */ jsx12(
        SimpleFieldRenderer,
        {
          fieldKey: key,
          fieldDef: headerFieldDef,
          value: block.data[key],
          renderers,
          error: errors?.[`${errorPath}.${key}`],
          onChange: (value) => updateData(key, value)
        },
        key
      )
    ) });
  }
  const showLabel = !blockType?.hideLabel;
  const label = blockType?.label ?? `Unknown block: ${block.type}`;
  const body = BlockComponent ? /* @__PURE__ */ jsx12(
    BlockComponent,
    {
      block,
      onChange: (data) => onChange({ ...block, data }),
      errors,
      errorPath,
      headerActionContainer
    }
  ) : blockType ? Object.entries(blockType.fields).filter(([key]) => !headerFieldKeys.has(key)).map(([key, fieldDef]) => /* @__PURE__ */ jsx12(
    BlockFieldRenderer,
    {
      fieldKey: key,
      fieldDef,
      value: block.data[key],
      renderers,
      previews,
      icons,
      errors,
      errorPath: `${errorPath}.${key}`,
      headerSlot: renderHeaderFields(fieldDef),
      onChange: (value) => updateData(key, value)
    },
    key
  )) : /* @__PURE__ */ jsxs9(Typography8, { variant: "body2", color: "text.secondary", children: [
    'No schema registered for block type "',
    block.type,
    '".'
  ] });
  const card = canReorder || onDelete ? /* @__PURE__ */ jsx12(
    BlockCardFrame,
    {
      gutter: canReorder && /* @__PURE__ */ jsx12(
        Box4,
        {
          ...handleProps,
          sx: { display: "flex", color: "primary.main" },
          children: icons?.drag ?? /* @__PURE__ */ jsx12(DragIndicatorIcon2, {})
        }
      ),
      title: showLabel ? label : void 0,
      action: /* @__PURE__ */ jsxs9(Stack8, { direction: "row", alignItems: "center", spacing: 1, children: [
        /* @__PURE__ */ jsx12(Box4, { ref: setHeaderActionContainer, sx: { display: "flex" } }),
        onDelete && /* @__PURE__ */ jsx12(
          IconButton4,
          {
            size: "small",
            onClick: onDelete,
            "aria-label": "Delete block",
            children: icons?.delete ?? /* @__PURE__ */ jsx12(DeleteOutlineIcon, {})
          }
        )
      ] }),
      children: body
    }
  ) : /* @__PURE__ */ jsx12(Card2, { children: /* @__PURE__ */ jsx12(CardContent, { sx: { p: 2.5, "&:last-child": { pb: 2.5 } }, children: /* @__PURE__ */ jsxs9(Stack8, { spacing: 2, children: [
    showLabel && /* @__PURE__ */ jsx12(Typography8, { variant: "subtitle1", children: label }),
    body
  ] }) }) });
  return /* @__PURE__ */ jsx12(
    "div",
    {
      ref: (element) => {
        itemProps.ref(element);
        elementRef(element);
      },
      style: itemProps.style,
      children: card
    }
  );
}

// src/components/ConfirmDialog.tsx
import WarningIcon from "@mui/icons-material/WarningAmber";
import {
  Button as Button3,
  Dialog as Dialog3,
  DialogActions as DialogActions2,
  DialogContent as DialogContent3,
  DialogTitle as DialogTitle3,
  Divider as Divider3,
  Stack as Stack9,
  SvgIcon,
  Typography as Typography9
} from "@mui/material";
import { jsx as jsx13, jsxs as jsxs10 } from "react/jsx-runtime";
function ConfirmDialog({
  open,
  title,
  description,
  subtitle,
  warning,
  confirmText = "Confirm",
  confirmColor = "error",
  isLoading = false,
  onClose,
  onConfirm
}) {
  return /* @__PURE__ */ jsxs10(
    Dialog3,
    {
      open,
      onClose: isLoading ? void 0 : onClose,
      maxWidth: "xs",
      fullWidth: true,
      children: [
        /* @__PURE__ */ jsxs10(DialogTitle3, { component: "div", children: [
          /* @__PURE__ */ jsx13(Typography9, { variant: "h6", children: title }),
          subtitle && /* @__PURE__ */ jsx13(Typography9, { variant: "body2", color: "text.secondary", component: "div", children: subtitle })
        ] }),
        /* @__PURE__ */ jsx13(Divider3, {}),
        /* @__PURE__ */ jsx13(DialogContent3, { children: /* @__PURE__ */ jsxs10(Stack9, { spacing: 1, children: [
          /* @__PURE__ */ jsx13(Typography9, { variant: "body2", color: "text.secondary", component: "div", children: description }),
          warning && /* @__PURE__ */ jsxs10(
            Typography9,
            {
              variant: "body2",
              color: "warning.main",
              component: "div",
              sx: { display: "flex", gap: 0.5 },
              children: [
                /* @__PURE__ */ jsx13(SvgIcon, { sx: { fontSize: 18, mt: 0.25 }, children: /* @__PURE__ */ jsx13(WarningIcon, {}) }),
                warning
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx13(Divider3, {}),
        /* @__PURE__ */ jsxs10(DialogActions2, { sx: { justifyContent: "flex-start", p: 2 }, children: [
          /* @__PURE__ */ jsx13(
            Button3,
            {
              onClick: onConfirm,
              variant: "contained",
              color: confirmColor,
              disabled: isLoading,
              children: confirmText
            }
          ),
          /* @__PURE__ */ jsx13(
            Button3,
            {
              onClick: onClose,
              variant: "outlined",
              color: "inherit",
              disabled: isLoading,
              children: "Cancel"
            }
          )
        ] })
      ]
    }
  );
}

// src/components/BlocksField.tsx
import { Fragment as Fragment4, jsx as jsx14, jsxs as jsxs11 } from "react/jsx-runtime";
function BlocksField({
  blockTypes,
  field,
  renderers,
  previews,
  icons,
  errors,
  blockComponents,
  canEditBlockList = false,
  header,
  footer,
  emptyState
}, ref) {
  const blocks = field.value ?? [];
  const [pendingDeleteIndex, setPendingDeleteIndex] = React6.useState(null);
  const [pendingScrollIndex, setPendingScrollIndex] = React6.useState(null);
  const blockElementsRef = React6.useRef(/* @__PURE__ */ new Map());
  React6.useImperativeHandle(
    ref,
    () => ({ scrollToBlock: (index) => setPendingScrollIndex(index) }),
    []
  );
  const {
    keys,
    replace: updateBlock,
    remove: deleteBlock,
    move: moveBlock
  } = useKeyedList(blocks, field.handleValueChange);
  const blockTypesByKey = React6.useMemo(
    () => Object.fromEntries(
      blockTypes.map((blockType) => [blockType.key, blockType])
    ),
    [blockTypes]
  );
  React6.useEffect(() => {
    if (pendingScrollIndex === null) return;
    setPendingScrollIndex(null);
    const key = keys[pendingScrollIndex];
    if (key === void 0) return;
    blockElementsRef.current.get(key)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [keys, pendingScrollIndex]);
  return /* @__PURE__ */ jsxs11(Fragment4, { children: [
    /* @__PURE__ */ jsxs11(Stack10, { spacing: canEditBlockList ? 3 : 2, children: [
      header,
      blocks.length === 0 && emptyState,
      /* @__PURE__ */ jsx14(SortableList, { ids: keys, onMove: moveBlock, children: blocks.map((block, index) => {
        const key = keys[index];
        if (key === void 0) {
          throw new Error(`Block ${index} has no key`);
        }
        return /* @__PURE__ */ jsx14(
          BlockCard,
          {
            sortableId: key,
            elementRef: (element) => {
              if (element) blockElementsRef.current.set(key, element);
              else blockElementsRef.current.delete(key);
            },
            block,
            blockType: blockTypesByKey[block.type],
            component: blockComponents?.[block.type],
            renderers,
            previews,
            icons,
            errors,
            errorPath: String(index),
            canReorder: canEditBlockList,
            onChange: (next) => updateBlock(index, next),
            onDelete: canEditBlockList ? () => setPendingDeleteIndex(index) : void 0
          },
          key
        );
      }) }),
      footer
    ] }),
    /* @__PURE__ */ jsx14(
      ConfirmDialog,
      {
        open: pendingDeleteIndex !== null,
        title: "Delete block",
        description: "Are you sure you want to delete this block?",
        confirmText: "Delete",
        onClose: () => setPendingDeleteIndex(null),
        onConfirm: () => {
          if (pendingDeleteIndex !== null) deleteBlock(pendingDeleteIndex);
          setPendingDeleteIndex(null);
        }
      }
    )
  ] });
}
var BlocksField_default = React6.forwardRef(BlocksField);

// src/components/DimensionSelect.tsx
import { Chip, MenuItem, Stack as Stack11, TextField, Typography as Typography10 } from "@mui/material";
import { jsx as jsx15, jsxs as jsxs12 } from "react/jsx-runtime";
function DimensionSelect({
  value,
  options,
  onChange,
  getChips,
  label,
  placeholder,
  disabled
}) {
  const renderOption = (optionValue) => {
    const option = options.find((candidate) => candidate.value === optionValue);
    if (!option) {
      return /* @__PURE__ */ jsx15(Typography10, { variant: "body2", color: "text.secondary", children: placeholder });
    }
    return /* @__PURE__ */ jsxs12(Stack11, { direction: "row", spacing: 1, alignItems: "center", children: [
      /* @__PURE__ */ jsx15("span", { children: option.label }),
      getChips?.(option.value).map((chip) => /* @__PURE__ */ jsx15(
        Chip,
        {
          size: "small",
          label: chip.label,
          color: chip.color
        },
        chip.label
      ))
    ] });
  };
  return /* @__PURE__ */ jsx15(
    TextField,
    {
      select: true,
      fullWidth: true,
      label,
      value,
      disabled,
      onChange: (event) => onChange(event.target.value),
      SelectProps: {
        displayEmpty: Boolean(placeholder),
        renderValue: (selected) => renderOption(String(selected))
      },
      children: options.map((option) => /* @__PURE__ */ jsx15(MenuItem, { value: option.value, children: renderOption(option.value) }, option.value))
    }
  );
}

// src/components/PreviewIframe.tsx
import { Box as Box5 } from "@mui/material";
import React7 from "react";
import { jsx as jsx16 } from "react/jsx-runtime";
function PreviewIframe({
  iframeRef,
  src,
  renderWidth,
  title = "Preview"
}) {
  const containerRef = React7.useRef(null);
  const [containerWidth, setContainerWidth] = React7.useState(0);
  React7.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);
  if (!src) return null;
  const scale = containerWidth > 0 ? Math.min(1, containerWidth / renderWidth) : 0.5;
  return /* @__PURE__ */ jsx16(Box5, { ref: containerRef, sx: { flex: 1, overflow: "hidden", p: 1.5, pt: 0 }, children: /* @__PURE__ */ jsx16(
    Box5,
    {
      sx: {
        width: "100%",
        maxWidth: renderWidth,
        height: "100%",
        overflow: "hidden",
        mx: "auto"
      },
      children: /* @__PURE__ */ jsx16(
        "iframe",
        {
          ref: iframeRef,
          src,
          title,
          style: {
            width: renderWidth,
            height: `${Math.round(100 / scale)}%`,
            border: "none",
            backgroundColor: "white",
            transformOrigin: "top left",
            transform: `scale(${scale})`,
            display: "block",
            borderRadius: 8
          }
        }
      )
    }
  ) });
}

// src/components/LivePreview.tsx
import { jsx as jsx17 } from "react/jsx-runtime";
function LivePreview({
  previewUrl,
  src,
  content,
  renderWidth,
  pagePath,
  globals,
  title
}) {
  const { iframeRef } = usePreviewSender({
    previewUrl,
    content,
    pagePath,
    globals
  });
  return /* @__PURE__ */ jsx17(
    PreviewIframe,
    {
      iframeRef,
      src,
      renderWidth,
      title
    }
  );
}

// src/components/PageEditor.tsx
import { Box as Box7, Button as Button5, Stack as Stack13 } from "@mui/material";
import React9 from "react";

// src/components/PreviewDeviceSelect.tsx
import { Devices, KeyboardArrowDown } from "@mui/icons-material";
import { FormControl, MenuItem as MenuItem2, Select } from "@mui/material";
import { jsx as jsx18 } from "react/jsx-runtime";
var DEVICE_LABELS = {
  desktop: "Desktop",
  tablet: "Tablet",
  mobile: "Mobile"
};
function PreviewDeviceSelect({
  value,
  onChange,
  labels
}) {
  return /* @__PURE__ */ jsx18(FormControl, { size: "small", children: /* @__PURE__ */ jsx18(
    Select,
    {
      value,
      onChange: (event) => onChange(event.target.value),
      startAdornment: /* @__PURE__ */ jsx18(Devices, { sx: { fontSize: 18, color: "text.secondary", mr: 1 } }),
      IconComponent: KeyboardArrowDown,
      sx: { bgcolor: "background.paper" },
      children: Object.keys(DEVICE_LABELS).map((device) => /* @__PURE__ */ jsx18(MenuItem2, { value: device, children: labels?.[device] ?? DEVICE_LABELS[device] }, device))
    }
  ) });
}

// src/components/PreviewLayout.tsx
import { Box as Box6, Stack as Stack12 } from "@mui/material";
import React8 from "react";

// src/components/PreviewToggleButton.tsx
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button as Button4 } from "@mui/material";
import { jsx as jsx19 } from "react/jsx-runtime";
function PreviewToggleButton({
  isPreviewVisible,
  onClick
}) {
  return /* @__PURE__ */ jsx19(
    Button4,
    {
      variant: "outlined",
      size: "small",
      startIcon: isPreviewVisible ? /* @__PURE__ */ jsx19(VisibilityOff, {}) : /* @__PURE__ */ jsx19(Visibility, {}),
      onClick,
      sx: { whiteSpace: "nowrap", bgcolor: "background.paper" },
      children: isPreviewVisible ? "Hide Preview" : "Show Preview"
    }
  );
}

// src/components/PreviewLayout.tsx
import { jsx as jsx20, jsxs as jsxs13 } from "react/jsx-runtime";
function PreviewLayout({
  children,
  preview,
  previewToolbar,
  previewWidth
}) {
  const [isPreviewVisible, setIsPreviewVisible] = React8.useState(true);
  return /* @__PURE__ */ jsxs13(Stack12, { direction: "row", sx: { flex: 1, height: "100%", minHeight: 0 }, children: [
    /* @__PURE__ */ jsxs13(
      Box6,
      {
        sx: {
          flex: 1,
          minWidth: 0,
          overflow: "auto",
          bgcolor: "background.level1"
        },
        children: [
          !isPreviewVisible && /* @__PURE__ */ jsx20(Box6, { sx: { px: 3, pt: 3 }, children: /* @__PURE__ */ jsx20(
            PreviewToggleButton,
            {
              isPreviewVisible: false,
              onClick: () => setIsPreviewVisible(true)
            }
          ) }),
          children
        ]
      }
    ),
    isPreviewVisible && /* @__PURE__ */ jsxs13(
      Stack12,
      {
        sx: {
          ...previewWidth ? { width: previewWidth, flexShrink: 0 } : { flex: 1, minWidth: 0 },
          bgcolor: "grey.200"
        },
        children: [
          /* @__PURE__ */ jsxs13(Stack12, { direction: "row", spacing: 1, sx: { p: 1.5, flexShrink: 0 }, children: [
            /* @__PURE__ */ jsx20(
              PreviewToggleButton,
              {
                isPreviewVisible: true,
                onClick: () => setIsPreviewVisible(false)
              }
            ),
            previewToolbar
          ] }),
          preview
        ]
      }
    )
  ] });
}

// src/components/PageEditor.tsx
import { jsx as jsx21, jsxs as jsxs14 } from "react/jsx-runtime";
var GLOBAL_PREVIEW_PATH = "home";
function PageEditor({
  blockTypes,
  field,
  renderers,
  previews,
  icons,
  errors,
  deviceLabels,
  previewUrl,
  pagePath,
  previewPath,
  previewContent,
  globalPagePaths = [],
  isSaving,
  publishDisabled,
  onPublish
}) {
  const [previewDevice, setPreviewDevice] = React9.useState("desktop");
  const isGlobal = globalPagePaths.includes(pagePath);
  const routePath = isGlobal ? GLOBAL_PREVIEW_PATH : previewPath ?? pagePath;
  const previewSrc = `${previewUrl}/${routePath === "home" ? "" : routePath}?preview`;
  return /* @__PURE__ */ jsxs14(
    Box7,
    {
      sx: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 },
      children: [
        /* @__PURE__ */ jsx21(
          PreviewLayout,
          {
            previewToolbar: /* @__PURE__ */ jsx21(
              PreviewDeviceSelect,
              {
                value: previewDevice,
                onChange: setPreviewDevice,
                labels: deviceLabels
              }
            ),
            preview: /* @__PURE__ */ jsx21(
              LivePreview,
              {
                previewUrl,
                src: previewSrc,
                content: previewContent,
                pagePath,
                globals: isGlobal ? { [pagePath]: previewContent } : void 0,
                renderWidth: preview_device_widths_default[previewDevice],
                title: "Page preview"
              }
            ),
            children: /* @__PURE__ */ jsx21(Box7, { sx: { p: 3, pb: 10 }, children: /* @__PURE__ */ jsx21(
              BlocksField_default,
              {
                blockTypes,
                field,
                renderers,
                previews,
                icons,
                errors
              }
            ) })
          }
        ),
        /* @__PURE__ */ jsx21(
          Stack13,
          {
            direction: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            sx: {
              px: 2,
              py: 1.5,
              flexShrink: 0,
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper"
            },
            children: /* @__PURE__ */ jsx21(
              Button5,
              {
                variant: "contained",
                onClick: onPublish,
                disabled: isSaving || publishDisabled,
                children: "Publish Changes"
              }
            )
          }
        )
      ]
    }
  );
}

// src/components/PublishState.tsx
import { Chip as Chip2 } from "@mui/material";
import { format, isBefore, parseISO } from "date-fns";
import { jsx as jsx22 } from "react/jsx-runtime";
function PublishState({
  item
}) {
  const dateFormat = "dd MMM yyyy, HH:mm";
  if (item.publishAt) {
    const publishDate = parseISO(item.publishAt);
    if (isBefore(/* @__PURE__ */ new Date(), publishDate)) {
      return /* @__PURE__ */ jsx22(
        Chip2,
        {
          label: format(parseISO(item.publishAt), dateFormat),
          color: "info"
        }
      );
    }
    return /* @__PURE__ */ jsx22(
      Chip2,
      {
        label: format(parseISO(item.publishAt), dateFormat),
        color: "success"
      }
    );
  }
  return /* @__PURE__ */ jsx22(Chip2, { label: "Draft", color: "warning" });
}

// src/components/SeoEditor.tsx
import { Box as Box8, Button as Button6, Chip as Chip3, Stack as Stack14, Typography as Typography11 } from "@mui/material";
import { FieldText as FieldText2 } from "@m10c/mui-kit";
import { Fragment as Fragment5, jsx as jsx23, jsxs as jsxs15 } from "react/jsx-runtime";
var FAVICON_CHIP_SIZE = 26;
var FAVICON_SIZE = 20;
function CharacterCount({
  value,
  min,
  max
}) {
  const count = value?.length ?? 0;
  const isGood = count >= min && count <= max;
  const isTooLong = count > max;
  return /* @__PURE__ */ jsxs15(Stack14, { direction: "row", spacing: 1, alignItems: "center", children: [
    /* @__PURE__ */ jsx23(
      Chip3,
      {
        size: "small",
        label: isTooLong ? "Too long" : isGood ? "Good" : "Too short",
        color: isTooLong ? "error" : isGood ? "success" : "warning"
      }
    ),
    /* @__PURE__ */ jsxs15(Typography11, { variant: "caption", color: "text.secondary", children: [
      "Character count: ",
      count,
      " (",
      min,
      "-",
      max,
      " recommended)"
    ] })
  ] });
}
function SeoEditor({
  pageTitleField,
  descriptionField,
  renderers,
  imageField,
  renderImageField,
  imagePreviewUrl,
  fallbackImageUrl,
  faviconUrl,
  fallbackTitle,
  siteName = "",
  isSaving,
  publishDisabled,
  onPublish
}) {
  const pageTitle = pageTitleField.value ?? "";
  const description = descriptionField.value ?? "";
  const socialImageUrl = imagePreviewUrl ?? fallbackImageUrl;
  return /* @__PURE__ */ jsxs15(
    Box8,
    {
      sx: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 },
      children: [
        /* @__PURE__ */ jsx23(
          Box8,
          {
            sx: {
              flex: 1,
              overflow: "auto",
              p: 4,
              pb: 10,
              bgcolor: "background.level1"
            },
            children: /* @__PURE__ */ jsxs15(Stack14, { direction: "row", sx: { gap: "56px", justifyContent: "center" }, children: [
              /* @__PURE__ */ jsxs15(Stack14, { sx: { width: 571 }, spacing: 3, children: [
                /* @__PURE__ */ jsxs15(Stack14, { spacing: 1, children: [
                  renderers?.text ? renderers.text({
                    name: "pageTitle",
                    label: "Page Title",
                    value: pageTitleField.value ?? null,
                    onChange: pageTitleField.handleValueChange
                  }) : /* @__PURE__ */ jsxs15(Fragment5, { children: [
                    /* @__PURE__ */ jsx23(Typography11, { variant: "subtitle2", children: "Page Title" }),
                    /* @__PURE__ */ jsx23(
                      FieldText2,
                      {
                        field: pageTitleField,
                        hiddenLabel: true,
                        size: "small",
                        fullWidth: true
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx23(CharacterCount, { value: pageTitle, min: 45, max: 60 })
                ] }),
                /* @__PURE__ */ jsxs15(Stack14, { spacing: 1, children: [
                  renderers?.textarea ? renderers.textarea({
                    name: "description",
                    label: "Description",
                    value: descriptionField.value ?? null,
                    onChange: descriptionField.handleValueChange
                  }) : /* @__PURE__ */ jsxs15(Fragment5, { children: [
                    /* @__PURE__ */ jsx23(Typography11, { variant: "subtitle2", children: "Description" }),
                    /* @__PURE__ */ jsx23(
                      FieldText2,
                      {
                        field: descriptionField,
                        hiddenLabel: true,
                        size: "small",
                        fullWidth: true,
                        multiline: true,
                        rows: 4
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx23(CharacterCount, { value: description, min: 100, max: 150 })
                ] }),
                imageField && renderImageField && renderImageField(imageField)
              ] }),
              /* @__PURE__ */ jsxs15(Stack14, { sx: { width: 555 }, spacing: 3, children: [
                /* @__PURE__ */ jsxs15(Stack14, { spacing: 1, children: [
                  /* @__PURE__ */ jsx23(Typography11, { variant: "subtitle2", children: "Search Preview" }),
                  /* @__PURE__ */ jsx23(
                    Box8,
                    {
                      sx: {
                        bgcolor: "white",
                        borderRadius: "20px",
                        p: 2,
                        boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 5px 22px 0px rgba(0,0,0,0.04)"
                      },
                      children: /* @__PURE__ */ jsxs15(Stack14, { spacing: 1.5, children: [
                        /* @__PURE__ */ jsxs15(Stack14, { direction: "row", spacing: 1, alignItems: "center", children: [
                          /* @__PURE__ */ jsx23(
                            Box8,
                            {
                              sx: {
                                width: FAVICON_CHIP_SIZE,
                                height: FAVICON_CHIP_SIZE,
                                borderRadius: "50%",
                                bgcolor: "grey.200",
                                flexShrink: 0,
                                backgroundImage: faviconUrl ? `url(${faviconUrl})` : void 0,
                                backgroundSize: FAVICON_SIZE,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center"
                              }
                            }
                          ),
                          /* @__PURE__ */ jsxs15(Stack14, { children: [
                            /* @__PURE__ */ jsx23(
                              Typography11,
                              {
                                sx: {
                                  fontFamily: "Arial, sans-serif",
                                  fontSize: 15,
                                  color: "#333",
                                  lineHeight: 1.2
                                },
                                children: fallbackTitle
                              }
                            ),
                            /* @__PURE__ */ jsx23(
                              Typography11,
                              {
                                sx: {
                                  fontFamily: "Arial, sans-serif",
                                  fontSize: 12,
                                  color: "#828282",
                                  lineHeight: 1.2
                                },
                                children: siteName
                              }
                            )
                          ] })
                        ] }),
                        /* @__PURE__ */ jsx23(
                          Typography11,
                          {
                            sx: {
                              fontFamily: "Arial, sans-serif",
                              fontSize: 22,
                              color: "#1718A4",
                              lineHeight: "22px"
                            },
                            children: pageTitle || fallbackTitle
                          }
                        ),
                        /* @__PURE__ */ jsx23(
                          Typography11,
                          {
                            sx: {
                              fontFamily: "Arial, sans-serif",
                              fontSize: 14,
                              color: "#333",
                              lineHeight: "22px"
                            },
                            children: description || "No description set"
                          }
                        )
                      ] })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs15(Stack14, { spacing: 1, children: [
                  /* @__PURE__ */ jsx23(Typography11, { variant: "subtitle2", children: "Social Media Preview" }),
                  /* @__PURE__ */ jsxs15(
                    Box8,
                    {
                      sx: {
                        bgcolor: "white",
                        borderRadius: "20px",
                        overflow: "hidden",
                        boxShadow: "0px 0px 0px 1px rgba(0,0,0,0.06), 0px 5px 22px 0px rgba(0,0,0,0.04)"
                      },
                      children: [
                        /* @__PURE__ */ jsx23(
                          Box8,
                          {
                            sx: {
                              height: 260,
                              bgcolor: "grey.300",
                              backgroundImage: socialImageUrl ? `url(${socialImageUrl})` : void 0,
                              backgroundSize: "cover",
                              backgroundPosition: "center"
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxs15(
                          Stack14,
                          {
                            sx: { bgcolor: "grey.100", px: 2, py: 1.5 },
                            spacing: 0.5,
                            children: [
                              /* @__PURE__ */ jsx23(
                                Typography11,
                                {
                                  sx: {
                                    fontSize: 12,
                                    color: "#65676B",
                                    textTransform: "uppercase",
                                    lineHeight: "15px"
                                  },
                                  children: siteName
                                }
                              ),
                              /* @__PURE__ */ jsx23(
                                Typography11,
                                {
                                  sx: {
                                    fontSize: 16,
                                    fontWeight: 510,
                                    color: "#0F1419",
                                    lineHeight: "19px"
                                  },
                                  children: pageTitle || fallbackTitle
                                }
                              ),
                              /* @__PURE__ */ jsx23(
                                Typography11,
                                {
                                  sx: {
                                    fontSize: 14,
                                    color: "#65676B",
                                    lineHeight: "19px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                  },
                                  children: description || "No description set"
                                }
                              )
                            ]
                          }
                        )
                      ]
                    }
                  )
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx23(
          Stack14,
          {
            direction: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            sx: {
              px: 3,
              py: 2,
              flexShrink: 0,
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper"
            },
            children: /* @__PURE__ */ jsx23(
              Button6,
              {
                variant: "contained",
                onClick: onPublish,
                disabled: isSaving || publishDisabled,
                children: "Publish Changes"
              }
            )
          }
        )
      ]
    }
  );
}

// src/components/UnsavedChangesDialog.tsx
import {
  Button as Button7,
  Dialog as Dialog4,
  DialogActions as DialogActions3,
  DialogContent as DialogContent4,
  DialogContentText,
  DialogTitle as DialogTitle4
} from "@mui/material";
import { jsx as jsx24, jsxs as jsxs16 } from "react/jsx-runtime";
function UnsavedChangesDialog({
  open,
  onClose,
  onSave,
  onContinueWithoutSaving
}) {
  return /* @__PURE__ */ jsxs16(Dialog4, { open, onClose, maxWidth: "xs", fullWidth: true, children: [
    /* @__PURE__ */ jsx24(DialogTitle4, { children: "Unsaved changes" }),
    /* @__PURE__ */ jsx24(DialogContent4, { children: /* @__PURE__ */ jsx24(DialogContentText, { children: "You have unsaved changes. Save them before leaving, or continue without saving?" }) }),
    /* @__PURE__ */ jsxs16(DialogActions3, { children: [
      /* @__PURE__ */ jsx24(Button7, { onClick: onClose, color: "inherit", children: "Cancel" }),
      /* @__PURE__ */ jsx24(Button7, { onClick: onContinueWithoutSaving, color: "error", children: "Continue without saving" }),
      /* @__PURE__ */ jsx24(Button7, { onClick: onSave, variant: "contained", children: "Save" })
    ] })
  ] });
}

// src/contexts/VariantEditorContext.tsx
import React10 from "react";
import { jsx as jsx25 } from "react/jsx-runtime";
var VariantEditorContext = React10.createContext(
  null
);
function VariantEditorProvider({ children, ...config }) {
  return /* @__PURE__ */ jsx25(VariantEditorContext.Provider, { value: config, children });
}
function useVariantEditorContext() {
  const context = React10.useContext(VariantEditorContext);
  if (!context) {
    throw new Error(
      "useVariantEditorContext must be used within a VariantEditorProvider"
    );
  }
  return context;
}

// src/hooks/use-dimension-switcher.ts
import { useApiRead } from "api-read-hook";

// src/utils/dimension-value.ts
function dimensionValue(variant, key) {
  const value = variant[key];
  if (typeof value !== "string" && typeof value !== "number") {
    throw new Error(`Variant ${variant["@id"]} has no "${key}" value`);
  }
  return String(value);
}

// src/utils/publish-status-chip.ts
import { format as format2, isFuture, parseISO as parseISO2 } from "date-fns";
function publishStatusChip(publishAt) {
  if (!publishAt) return { label: "Draft", color: "warning" };
  const publishDate = parseISO2(publishAt);
  return {
    label: format2(publishDate, "dd MMM yyyy"),
    color: isFuture(publishDate) ? "info" : "success"
  };
}

// src/hooks/use-dimension-switcher.ts
function useDimensionSwitcher({
  dimension,
  defaultValue,
  variants,
  value,
  onValueChange,
  publishable = true
}) {
  const findVariant = (target) => variants.find(
    (variant) => dimensionValue(variant, dimension.key) === target
  ) ?? null;
  const currentVariant = findVariant(value);
  const defaultVariant = findVariant(defaultValue);
  const otherVariants = variants.filter(
    (variant) => variant !== currentVariant
  );
  const sourceVariant = value === defaultValue ? null : defaultVariant ?? (otherVariants.length === 1 ? otherVariants[0] ?? null : null);
  const detailRead = useApiRead(currentVariant?.["@id"] ?? null, {
    staleWhileInvalidated: true
  });
  const currentDetail = detailRead.data && detailRead.data["@id"] === currentVariant?.["@id"] ? detailRead.data : null;
  const hasDetailError = currentDetail === null && detailRead.error !== void 0;
  const getChips = (target) => {
    const chips = [];
    if (target === defaultValue) {
      chips.push({ label: "Default", color: "default" });
    }
    const variant = findVariant(target);
    if (publishable && variant)
      chips.push(publishStatusChip(variant.publishAt));
    return chips;
  };
  return {
    dimension,
    value,
    isDefault: value === defaultValue,
    currentVariant,
    sourceVariant,
    currentDetail,
    isLoadingDetail: currentVariant !== null && currentDetail === null && !hasDetailError,
    hasDetailError,
    reloadDetail: detailRead.invalidate,
    setValue: onValueChange,
    getLabel: (target) => dimension.options.find((option) => option.value === target)?.label ?? target,
    getChips
  };
}

// src/hooks/use-unsaved-changes-guard.ts
import { useRef, useState } from "react";
function useUnsavedChangesGuard({
  hasUnsavedChanges,
  onSave
}) {
  const [hasPending, setHasPending] = useState(false);
  const pendingActionRef = useRef(null);
  const guard = (action) => {
    if (hasUnsavedChanges) {
      pendingActionRef.current = action;
      setHasPending(true);
    } else {
      action();
    }
  };
  const guardNavigate = async (navigate) => {
    if (!hasUnsavedChanges) return true;
    guard(navigate);
    return false;
  };
  const handlePending = async (save) => {
    if (save) {
      const success = await onSave();
      if (!success) return;
    }
    pendingActionRef.current?.();
    pendingActionRef.current = null;
    setHasPending(false);
  };
  const dismissPending = () => {
    pendingActionRef.current = null;
    setHasPending(false);
  };
  return {
    guard,
    guardNavigate,
    hasUnsavedChanges,
    hasPending,
    handlePending,
    dismissPending
  };
}

// src/hooks/use-variant-actions.ts
import { useInvalidation } from "api-read-hook";
function useVariantActions({
  identityIri,
  variantsPath,
  entityLabel,
  listPath,
  dimension,
  variants,
  value,
  currentVariant
}) {
  const { callApi, toast, push } = useVariantEditorContext();
  const { invalidateMatching } = useInvalidation();
  const invalidate = () => invalidateMatching(identityIri);
  return {
    translate: async (fields, source) => {
      const response = await callApi(
        `${source["@id"]}/translate`,
        { method: "POST", jsonBody: { targetLocale: value, fields } }
      );
      return response?.data.translations ?? null;
    },
    submit: async (values, { addSubmitError, setLoading }) => {
      setLoading(true);
      const response = currentVariant ? await callApi(
        currentVariant["@id"],
        { method: "PATCH", jsonBody: values },
        { addSubmitError }
      ) : await callApi(
        variantsPath,
        {
          method: "POST",
          jsonBody: {
            ...values,
            identity: identityIri,
            [dimension.key]: value
          }
        },
        { addSubmitError }
      );
      setLoading(false);
      if (!response) return false;
      toast.success(`${entityLabel} saved`);
      invalidate();
      return true;
    },
    publish: async (publishAt) => {
      if (!currentVariant) return false;
      const response = await callApi(`${currentVariant["@id"]}/publish`, {
        method: "POST",
        jsonBody: { publishAt }
      });
      if (!response) return false;
      toast.success(`${entityLabel} published`);
      invalidate();
      return true;
    },
    unpublish: async () => {
      if (!currentVariant) return false;
      const response = await callApi(`${currentVariant["@id"]}/unpublish`, {
        method: "POST",
        jsonBody: {}
      });
      if (!response) return false;
      toast.success(`${entityLabel} unpublished`);
      invalidate();
      return true;
    },
    remove: async () => {
      if (!currentVariant) return false;
      const response = await callApi(currentVariant["@id"], {
        method: "DELETE"
      });
      if (!response) return false;
      if (variants.length === 1) {
        toast.success(`${entityLabel} deleted`);
        push(listPath);
      } else {
        toast.success(`${dimension.label} deleted`);
        invalidate();
      }
      return true;
    },
    invalidate
  };
}

// src/hooks/use-variant-editor.ts
import React12 from "react";

// src/hooks/use-variant-form.ts
import React11 from "react";
import { useForm } from "react-typed-form";
function useVariantForm({
  savedValues,
  resetKey,
  onSubmit
}) {
  const form = useForm({
    defaultValues: {},
    pristineValues: savedValues,
    onSubmit
  });
  const [formKey, setFormKey] = React11.useState(resetKey);
  if (formKey !== resetKey) {
    setFormKey(resetKey);
    form.reset();
  }
  return form;
}

// src/hooks/use-variant-editor.ts
function useVariantEditor({
  identityIri,
  variantsPath,
  entityLabel,
  listPath,
  variants,
  toFormValues,
  dimension: dimensionOverride,
  defaultValue,
  publishable = true,
  postValidateTransform
}) {
  const { getParams, setParams, defaultDimension } = useVariantEditorContext();
  const dimension = dimensionOverride ?? defaultDimension;
  const firstVariant = variants[0];
  const initialValue = defaultValue ?? (firstVariant ? dimensionValue(firstVariant, dimension.key) : dimension.options[0]?.value);
  if (!initialValue) {
    throw new Error(`Dimension "${dimension.key}" has no options`);
  }
  const paramValue = getParams()[dimension.key];
  const isKnownValue = dimension.options.some(
    (option) => option.value === paramValue
  );
  const switcher = useDimensionSwitcher({
    dimension,
    defaultValue,
    variants,
    value: isKnownValue && paramValue ? paramValue : initialValue,
    onValueChange: (next) => setParams({ [dimension.key]: next }),
    publishable
  });
  const { currentVariant, currentDetail, sourceVariant, value } = switcher;
  const actions = useVariantActions({
    identityIri,
    variantsPath,
    entityLabel,
    listPath,
    dimension,
    variants,
    value,
    currentVariant
  });
  const savedValues = React12.useMemo(
    () => toFormValues(currentDetail),
    [toFormValues, currentDetail]
  );
  const form = useVariantForm({
    savedValues,
    resetKey: `${currentVariant?.["@id"] ?? `new:${value}`}:${currentDetail?.updatedAt ?? ""}`,
    onSubmit: async (values, { addSubmitError, setLoading }) => {
      const body = postValidateTransform ? postValidateTransform(values) : values;
      const success = await actions.submit(body, {
        addSubmitError: (field, error) => addSubmitError(field, error),
        setLoading
      });
      if (success) switcher.reloadDetail();
      return success;
    }
  });
  const guard = useUnsavedChangesGuard({
    hasUnsavedChanges: form.hasDirty,
    onSave: () => form.handleSubmit()
  });
  const [isTranslating, setIsTranslating] = React12.useState(false);
  const translate = async (fields) => {
    if (!sourceVariant) return null;
    setIsTranslating(true);
    try {
      return await actions.translate(fields, sourceVariant);
    } finally {
      setIsTranslating(false);
    }
  };
  const remove = async () => {
    if (!currentVariant) return false;
    const success = await actions.remove();
    if (!success) return false;
    const remaining = variants.find(
      (variant) => variant["@id"] !== currentVariant["@id"]
    );
    if (remaining) switcher.setValue(dimensionValue(remaining, dimension.key));
    return true;
  };
  return {
    dimension,
    value,
    isDefault: switcher.isDefault,
    currentVariant,
    currentDetail,
    sourceVariant,
    isLoadingDetail: switcher.isLoadingDetail,
    hasDetailError: switcher.hasDetailError,
    reloadDetail: switcher.reloadDetail,
    getLabel: switcher.getLabel,
    getChips: switcher.getChips,
    form,
    guard,
    canTranslate: Boolean(dimension.translatable) && sourceVariant !== null,
    isTranslating,
    isPublished: currentVariant?.publishAt != null,
    isNewVariant: currentVariant === null,
    isLastVariant: variants.length === 1,
    switchTo: (next) => guard.guard(() => switcher.setValue(next)),
    save: () => form.handleSubmit(),
    publish: actions.publish,
    unpublish: actions.unpublish,
    remove,
    translate,
    invalidate: actions.invalidate
  };
}

// src/utils/create-block.ts
function createBlock(blockType) {
  return {
    type: blockType.key,
    data: Object.fromEntries(
      Object.entries(blockType.fields).map(([key, fieldDef]) => [
        key,
        emptyFieldValue(fieldDef)
      ])
    )
  };
}
export {
  AddBlockDialog,
  BlockCardFrame,
  BlocksField_default as BlocksField,
  ConfirmDialog,
  DimensionSelect,
  LivePreview,
  preview_device_widths_default as PREVIEW_DEVICE_WIDTHS,
  preview_message_default as PREVIEW_MESSAGE,
  PageEditor,
  PreviewDeviceSelect,
  PreviewIframe,
  PreviewLayout,
  PreviewToggleButton,
  PublishState,
  SeoEditor,
  SortableList,
  UnsavedChangesDialog,
  VariantEditorProvider,
  createBlock,
  dimensionValue,
  emptyFieldValue,
  moveItem,
  publishStatusChip,
  useDimensionSwitcher,
  useKeyedList,
  usePreviewReceiver,
  usePreviewSender,
  useSortableItem,
  useUnsavedChangesGuard,
  useVariantActions,
  useVariantEditor,
  useVariantEditorContext,
  useVariantForm,
  useWebsiteGlobalData,
  useWebsitePageData
};
//# sourceMappingURL=index.js.map