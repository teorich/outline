// @flow
import { observer } from "mobx-react";
import * as React from "react";
import { useTranslation, Trans } from "react-i18next";
import Group from "models/Group";
import Button from "components/Button";
import Flex from "components/Flex";
import HelpText from "components/HelpText";
import Input from "components/Input";
import useStores from "hooks/useStores";

type Props = {
  group: Group,
  onSubmit: () => void,
};

function GroupEdit({ group, onSubmit }: Props) {
  const { ui } = useStores();
  const { t } = useTranslation();
  const [name, setName] = React.useState(group.name);
  const [isSaving, setIsSaving] = React.useState();

  const handleSubmit = React.useCallback(
    async (ev: SyntheticEvent<>) => {
      ev.preventDefault();
      setIsSaving(true);

      try {
        await group.save({ name: name });
        onSubmit();
      } catch (err) {
        ui.showToast(err.message, { type: "error" });
      } finally {
        setIsSaving(false);
      }
    },
    [group, onSubmit, ui, name]
  );

  const handleNameChange = React.useCallback((ev: SyntheticInputEvent<*>) => {
    setName(ev.target.value);
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <HelpText>
        <Trans>
          You can edit the name of this group at any time, however doing so too
          often might confuse your team mates.
        </Trans>
      </HelpText>
      <Flex>
        <Input
          type="text"
          label={t("Name")}
          onChange={handleNameChange}
          value={name}
          required
          autoFocus
          flex
        />
      </Flex>

      <Button type="submit" disabled={isSaving || !name}>
        {isSaving ? `${t("Saving")}…` : t("Save")}
      </Button>
    </form>
  );
}

export default observer(GroupEdit);
