package com.papsnet.openissue.translation;

import java.util.List;

public interface MachineTranslationModule {
    public String translate(String target);
    public <T> List<T> translateObjects(List<T> target);
    public boolean validate(String target);
}
