// @flow
import { observer } from "mobx-react";
import * as React from "react";
import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import Document from "models/Document";
import Button from "components/Button";
import Flex from "components/Flex";
import HelpText from "components/HelpText";
import useStores from "hooks/useStores";
import { documentUrl } from "utils/routeHelpers";

type Props = {
  document: Document,
  onSubmit: () => void,
};

function DocumentTemplatize({ document, onSubmit }: Props) {
  const [isSaving, setIsSaving] = useState();
  const history = useHistory();
  const { ui } = useStores();
  const { t } = useTranslation();

  const handleSubmit = React.useCallback(
    async (ev: SyntheticEvent<>) => {
      ev.preventDefault();
      setIsSaving(true);

      try {
        const template = await document.templatize();
        history.push(documentUrl(template));
        ui.showToast(t("Template created, go ahead and customize it"), {
          type: "info",
        });
        onSubmit();
      } catch (err) {
        ui.showToast(err.message, { type: "error" });
      } finally {
        setIsSaving(false);
      }
    },
    [document, ui, history, onSubmit, t]
  );

  return (
    <Flex column>
      <form onSubmit={handleSubmit}>
        <HelpText>
          <Trans
            defaults="Creating a template from <em>{{titleWithDefault}}</em> is a non-destructive action – we'll make a copy of the document and turn it into a template that can be used as a starting point for new documents."
            values={{ titleWithDefault: document.titleWithDefault }}
            components={{ em: <strong /> }}
          />
        </HelpText>
        <Button type="submit">
          {isSaving ? `${t("Creating")}…` : t("Create template")}
        </Button>
      </form>
    </Flex>
  );
}

export default observer(DocumentTemplatize);
